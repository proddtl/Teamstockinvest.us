-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Create default account with sample balance
  INSERT INTO public.accounts (user_id, account_balance)
  VALUES (NEW.id, 62800.00)
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update account balances after transactions
CREATE OR REPLACE FUNCTION public.update_account_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    CASE NEW.type
      WHEN 'deposit' THEN
        UPDATE public.accounts 
        SET 
          account_balance = account_balance + NEW.amount,
          total_deposit = total_deposit + NEW.amount,
          updated_at = NOW()
        WHERE user_id = NEW.user_id;
      WHEN 'withdraw' THEN
        UPDATE public.accounts 
        SET 
          account_balance = account_balance - NEW.amount,
          total_withdraw = total_withdraw + NEW.amount,
          updated_at = NOW()
        WHERE user_id = NEW.user_id;
      WHEN 'invest' THEN
        UPDATE public.accounts 
        SET 
          account_balance = account_balance - NEW.amount,
          total_invest = total_invest + NEW.amount,
          current_invest = current_invest + NEW.amount,
          updated_at = NOW()
        WHERE user_id = NEW.user_id;
      WHEN 'transfer' THEN
        UPDATE public.accounts 
        SET 
          account_balance = account_balance - NEW.amount,
          updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for transaction updates
DROP TRIGGER IF EXISTS on_transaction_completed ON public.transactions;
CREATE TRIGGER on_transaction_completed
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_account_balance();
