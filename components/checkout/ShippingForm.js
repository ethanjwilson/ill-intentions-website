import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import ShippingShellForm from "./ShippingShellForm";
import { countryConfig } from "../../utils/countryConfig";

const ShippingForm = ({ disabled }) => {
  const { unregister, watch, getValues, setValue } = useFormContext();
  const [currentCountry, setCurrentCountry] = useState("");

  const showShipping = watch("isShipped");
  const country = watch("country");

  useEffect(() => {
    if (!showShipping) {
      unregister(["address", "city", "code", "area"]);
    }
    if (showShipping && country !== currentCountry) {
      setValue("address", "", { shouldValidate: true });
      setValue("city", "", { shouldValidate: true });
      setValue("code", "", { shouldValidate: true });
      setValue("area", "", { shouldValidate: true });
    }
    setCurrentCountry(getValues("country"));
  }, [showShipping, country]);

  return showShipping && country ? <ShippingShellForm {...countryConfig[country]} disabled={disabled} /> : null;
};

export default ShippingForm;
