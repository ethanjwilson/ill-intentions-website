import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import ShippingShellForm from "./ShippingShellForm";
import { countryConfig } from "../../utils/countryConfig";

interface ShippingFormProps {
  disabled: boolean;
}

const ShippingForm = ({ disabled }: ShippingFormProps) => {
  const { unregister, watch, getValues, setValue } = useFormContext();
  const [currentCountry, setCurrentCountry] = useState("");

  const showShipping = watch("isShipped");
  const country = watch("country");

  useEffect(() => {
    if (!showShipping) {
      unregister(["address", "city", "code", "area"]);
    }
    if (showShipping && country !== currentCountry) {
      setValue("address", "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setValue("city", "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setValue("code", "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setValue("area", "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }
    setCurrentCountry(getValues("country"));
  }, [showShipping, country]);

  return showShipping && country && country.length > 0 ? <ShippingShellForm {...countryConfig[country]} disabled={disabled} /> : null;
};

export default ShippingForm;
