-- Trigger to notify donor when donation is accepted
CREATE OR REPLACE FUNCTION public.notify_donor_on_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    IF NEW.status = 'accepted' THEN
      INSERT INTO public.notifications (user_id, title, message)
      VALUES (
        NEW.donor_id,
        'Donation Accepted!',
        'An NGO/Volunteer has accepted your food donation. They will contact you shortly.'
      );
    ELSIF NEW.status = 'collected' THEN
      INSERT INTO public.notifications (user_id, title, message)
      VALUES (
        NEW.donor_id,
        'Food Collected',
        'Your food donation has been collected by the volunteer.'
      );
    ELSIF NEW.status = 'distributed' THEN
      INSERT INTO public.notifications (user_id, title, message)
      VALUES (
        NEW.donor_id,
        'Mission Accomplished!',
        'Your food donation has been successfully distributed to the needy. Thank you for your kindness!'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_donation_status_change
  AFTER UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_donor_on_status_change();

-- Trigger to notify NGOs when a new donation is posted
CREATE OR REPLACE FUNCTION public.notify_ngos_on_new_donation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  ngo_id uuid;
BEGIN
  FOR ngo_id IN (SELECT id FROM public.profiles WHERE role IN ('ngo', 'volunteer') AND is_approved = true) LOOP
    INSERT INTO public.notifications (user_id, title, message)
    VALUES (
      ngo_id,
      'New Food Donation Nearby',
      'A new donation for ' || NEW.quantity || ' people is available for pickup.'
    );
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_donation
  AFTER INSERT ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_ngos_on_new_donation();
