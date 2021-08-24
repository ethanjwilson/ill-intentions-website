import CustomerForm from "./CustomerForm";
import DeliveryForm from "./DeliveryForm";
import ShippingForm from "./ShippingForm";

interface CheckoutFormProps {
  disabled: boolean;
}

const CheckoutForm = ({ disabled }: CheckoutFormProps) => {
  return (
    <>
      <DeliveryForm disabled={disabled} />
      <CustomerForm disabled={disabled} />
      <ShippingForm disabled={disabled} />
    </>
  );
};

export default CheckoutForm;
