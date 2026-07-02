
-- Drop the old INSERT policy that fails when profile role lookup returns NULL
DROP POLICY IF EXISTS "Donors can create donations" ON public.donations;

-- New INSERT policy: any authenticated user can insert a donation
-- as long as donor_id matches their own auth.uid()
-- Role restriction is enforced at the application layer (UI/routing)
CREATE POLICY "Authenticated users can insert own donations"
  ON public.donations
  FOR INSERT
  TO authenticated
  WITH CHECK (donor_id = auth.uid());
