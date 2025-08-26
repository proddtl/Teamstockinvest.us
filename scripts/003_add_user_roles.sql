-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create admin policies for analytics access
CREATE POLICY "profiles_admin_select_all" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "accounts_admin_select_all" ON public.accounts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "transactions_admin_select_all" ON public.transactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create analytics view for admin dashboard
CREATE OR REPLACE VIEW public.analytics_summary AS
SELECT 
  COUNT(DISTINCT p.id) as total_users,
  COUNT(DISTINCT CASE WHEN p.created_at >= NOW() - INTERVAL '30 days' THEN p.id END) as new_users_30d,
  COALESCE(SUM(a.account_balance), 0) as total_balance,
  COALESCE(SUM(a.total_deposit), 0) as total_deposits,
  COALESCE(SUM(a.total_withdraw), 0) as total_withdrawals,
  COALESCE(SUM(a.total_invest), 0) as total_investments,
  COUNT(t.id) as total_transactions,
  COUNT(CASE WHEN t.created_at >= NOW() - INTERVAL '7 days' THEN t.id END) as transactions_7d
FROM public.profiles p
LEFT JOIN public.accounts a ON p.id = a.user_id
LEFT JOIN public.transactions t ON p.id = t.user_id;

-- Grant access to analytics view for admins only
CREATE POLICY "analytics_admin_only" ON public.analytics_summary FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
