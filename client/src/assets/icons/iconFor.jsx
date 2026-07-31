import IconEntertainment from "./IconEntertainment.svg?react";
import IconFood from "./IconFood.svg?react";
import IconHousing from "./IconHousing.svg?react";
import IconOthers from "./IconOthers.svg?react";
import IconShopping from "./IconShopping.svg?react";
import IconTransportation from "./IconTransportation.svg?react";

// Ключи покрывают оба набора имён: category у транзакций и iconName у категорий.
const icons = {
  Food: IconFood,
  Transport: IconTransportation,
  Fun: IconEntertainment,
  Entertainment: IconEntertainment,
  Shopping: IconShopping,
  Housing: IconHousing,
};

export const iconFor = (name) => {
  const Icon = icons[name] ?? IconOthers;
  return <Icon />;
};
