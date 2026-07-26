import { useState } from "react";
import NewCategoryModal from "./NewCategoryModal";
import { useTranslation } from 'react-i18next';

const AddCategoryButton = () => {
  const [showModal, setShowModal] = useState(false);
   const {t} = useTranslation();

  return (
    <>
      <div>
        <button onClick={() => setShowModal(true)}>
          {t("Add new category")}
        </button>
      </div>
      {showModal && (
        <NewCategoryModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default AddCategoryButton;
