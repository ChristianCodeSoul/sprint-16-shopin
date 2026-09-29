const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) return;

  try {
    setMessage("");

    await deleteProduct(id).unwrap();

    setMessage("Product deleted.");
  } catch (error) {
    setMessage(
      error?.data?.message ||
      "Failed to delete product."
    );
  }
};