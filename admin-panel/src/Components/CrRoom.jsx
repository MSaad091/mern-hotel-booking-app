// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Createroom } from "../../api";
// import '../stylesheets/CrRoom.css';

// function CrRoom() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [type, setType] = useState("");
//   const [price, setPrice] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [description, setDescription] = useState("");
//   const [amenities, setAmenities] = useState("");
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
   

//   // Handle image selection and preview
//   const handleImageChange = (e) => {
//     const selectedFiles = Array.from(e.target.files).slice(0, 3); // max 3
//     setImages(selectedFiles);
//     setMessage({ text: "", type: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validation
//     if (images.length === 0) {
//       setMessage({ 
//         text: "Please select at least one image", 
//         type: "error" 
//       });
//       return;
//     }

//     if (!name.trim() || !type || !price || !capacity) {
//       setMessage({ 
//         text: "Please fill in all required fields", 
//         type: "error" 
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage({ text: "", type: "" });
      
//       const formData = new FormData();
//       formData.append("name", name.trim());
//       formData.append("type", type);
//       formData.append("price", price);
//       formData.append("capacity", capacity);
//       formData.append("description", description.trim());
//       formData.append("amenities", amenities.trim());

//       images.forEach((img) => formData.append("images", img));

//       const response = await Createroom(id, formData);
//       console.log(response.data);

//       setMessage({ 
//         text: "Room Created Successfully ✅", 
//         type: "success" 
//       });
      
//       // Navigate after a brief delay to show success message
//       setTimeout(() => {
//         navigate("/hotel");
//       }, 1500);
      
//     } catch (error) {
//       console.error(error);
//       setMessage({ 
//         text: "Failed to create room. Please try again.", 
//         type: "error" 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="create-room-page">
//       <div className="form-container">
//         <h2>Create New Room</h2>
        
//         {message.text && (
//           <div 
//             className="alert-message" 
//             style={{
//               backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
//               color: message.type === 'error' ? '#991b1b' : '#166534',
//               border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
//             }}
//           >
//             {message.text}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit} className="create-room-form">
//           <input
//             type="text"
//             placeholder="Room Name *"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />

//           <select
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             required
//           >
//             <option value="">Select Room Type *</option>
//             <option value="Single">Single</option>
//             <option value="Double">Double</option>
//             <option value="Suite">Suite</option>
//             <option value="Deluxe">Deluxe</option>
//             <option value="Executive">Executive</option>
//             <option value="Presidential">Presidential</option>
//           </select>

//           <input
//             type="number"
//             placeholder="Capacity (Persons) *"
//             value={capacity}
//             min="1"
//             max="10"
//             onChange={(e) =>
//               setCapacity(e.target.value === "" ? "" : Number(e.target.value))
//             }
//             required
//           />

//           <input
//             type="number"
//             placeholder="Price per Night ($) *"
//             value={price}
//             min="1"
//             onChange={(e) =>
//               setPrice(e.target.value === "" ? "" : Number(e.target.value))
//             }
//             required
//           />

//           <textarea
//             placeholder="Description (Optional)"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             maxLength="500"
//           />

//           <input
//             type="text"
//             placeholder="Amenities (e.g., WiFi, AC, TV, Mini Bar)"
//             value={amenities}
//             onChange={(e) => setAmenities(e.target.value)}
//           />

//           <div className="file-input-container">
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageChange}
//             />
//             {images.length > 0 && (
//               <span className="file-count">
//                 {images.length} file{images.length > 1 ? 's' : ''} selected
//               </span>
//             )}
//           </div>

//           {images.length > 0 && (
//             <div className="image-preview">
//               {images.map((img, index) => (
//                 <img
//                   key={index}
//                   src={URL.createObjectURL(img)}
//                   alt={`preview-${index}`}
//                 />
//               ))}
//             </div>
//           )}

//           <button type="submit" disabled={loading}>
//             {loading ? (
//               <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
//                 <span className="spinner"></span>
//                 Creating Room...
//               </span>
//             ) : (
//               "Create Room"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CrRoom;
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Createroom } from "../../api";
import "../stylesheets/CrRoom.css";

function CrRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 🔥 UPDATED IMAGE HANDLER
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setImages((prevImages) => {
      const combined = [...prevImages, ...selectedFiles];
      return combined.slice(0, 3); // max 3 images
    });

    setMessage({ text: "", type: "" });

    // reset input so same file can be selected again
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setMessage({
        text: "Please select at least one image",
        type: "error",
      });
      return;
    }

    if (!name.trim() || !type || !price || !capacity) {
      setMessage({
        text: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("type", type);
      formData.append("price", price);
      formData.append("capacity", capacity);
      formData.append("description", description.trim());
      formData.append("amenities", amenities.trim());

      images.forEach((img) => formData.append("images", img));

      const response = await Createroom(id, formData);
      console.log(response.data);

      setMessage({
        text: "Room Created Successfully ✅",
        type: "success",
      });

      // Reset form
      setName("");
      setType("");
      setPrice("");
      setCapacity("");
      setDescription("");
      setAmenities("");
      setImages([]);

      setTimeout(() => {
        navigate("/hotel");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage({
        text: "Failed to create room. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-room-page">
      <div className="form-container">
        <h2>Create New Room</h2>

        {message.text && (
          <div
            className="alert-message"
            style={{
              backgroundColor:
                message.type === "error" ? "#fee2e2" : "#dcfce7",
              color: message.type === "error" ? "#991b1b" : "#166534",
              border: `1px solid ${
                message.type === "error" ? "#fecaca" : "#bbf7d0"
              }`,
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-room-form">
          <input
            type="text"
            placeholder="Room Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Room Type *</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Executive">Executive</option>
            <option value="Presidential">Presidential</option>
          </select>

          <input
            type="number"
            placeholder="Capacity (Persons) *"
            value={capacity}
            min="1"
            max="10"
            onChange={(e) =>
              setCapacity(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />

          <input
            type="number"
            placeholder="Price per Night ($) *"
            value={price}
            min="1"
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />

          <textarea
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="500"
          />

          <input
            type="text"
            placeholder="Amenities (WiFi, AC, TV...)"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
          />

          {/* FILE INPUT */}
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />

            {images.length > 0 && (
              <span className="file-count">
                {images.length} file{images.length > 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div
              className="image-preview"
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "10px",
              }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating Room..." : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrRoom; 