import React, { useState } from "react";
import { Createproduct } from "../../api";
import { toast } from "react-toastify";
import "../stylesheets/CreateProduct.css";

function CreateProduct() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Validation
    if (!name || !city || !address || !description) {
      toast.error("All fields are required");
      return;
    }

    try {
      const data = { name, city, address, description };
      const request = await Createproduct(data);
      const response = request.data;
      console.log(response);
      

      if (response.success) {
        toast.success("Product created successfully 🎉");

        // Clear form
        setName("");
        setCity("");
        setAddress("");
        setDescription("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="create-product-container">
      <form className="create-product-form" onSubmit={handleSubmit}>
        <h2>Create Product</h2>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}

export default CreateProduct;
