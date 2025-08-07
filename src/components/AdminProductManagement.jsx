import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import './AdminProductManagement.css';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAllProducts();
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError('Failed to fetch products');
        }
      } catch (error) {
        setError('Error loading products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    colors: [{ name: '', stock: '' }],
    images: []
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccessMessage('');

      // Get admin token from localStorage (you'll need to implement admin login)
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Admin authentication required');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
             formData.append('name', newProduct.name);
       formData.append('description', newProduct.description);
       formData.append('price', parseFloat(newProduct.price));
       formData.append('category', newProduct.category);
       formData.append('stock', parseInt(newProduct.stock));
       const validColors = newProduct.colors.filter(color => color.name && color.name.trim() !== '');
       console.log('Valid colors for submission:', validColors);
       formData.append('colors', JSON.stringify(validColors));

      // Append each image file
      newProduct.images.forEach((file, index) => {
        if (file instanceof File) {
          formData.append('images', file);
        }
      });

      const response = await productAPI.createProduct(formData, token);
      
      if (response.success) {
        setSuccessMessage('Product added successfully!');
        // Refresh the products list
        const refreshResponse = await productAPI.getAllProducts();
        if (refreshResponse.success) {
          setProducts(refreshResponse.data || []);
        }
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      colors: [{ name: '', stock: '' }],
      images: []
    });
        setShowAddForm(false);
      } else {
        setError(response.message || 'Failed to add product');
      }
    } catch (error) {
      setError('Error adding product: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setError(null);
        setSuccessMessage('');

        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('Admin authentication required');
          return;
        }

        const response = await productAPI.deleteProduct(id, token);
        
        if (response.success) {
          setSuccessMessage('Product deleted successfully!');
          // Refresh the products list
          const refreshResponse = await productAPI.getAllProducts();
          if (refreshResponse.success) {
            setProducts(refreshResponse.data || []);
          }
        } else {
          setError(response.message || 'Failed to delete product');
        }
      } catch (error) {
        setError('Error deleting product: ' + error.message);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      colors: product.colors || [],
      images: product.images || []
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccessMessage('');

      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Admin authentication required');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
             formData.append('name', editingProduct.name);
       formData.append('description', editingProduct.description);
       formData.append('price', parseFloat(editingProduct.price));
       formData.append('category', editingProduct.category);
       formData.append('stock', parseInt(editingProduct.stock));
       const validColors = editingProduct.colors.filter(color => color.name && color.name.trim() !== '');
       console.log('Valid colors for update submission:', validColors);
       formData.append('colors', JSON.stringify(validColors));

      // Handle images: separate existing images from new file uploads
      const existingImages = [];
      const newImages = [];
      
      editingProduct.images.forEach((image, index) => {
        if (image instanceof File) {
          // This is a new file upload
          newImages.push(image);
          formData.append('images', image);
        } else if (typeof image === 'string' && image.startsWith('/uploads/')) {
          // This is an existing image URL that should be kept
          existingImages.push(image);
        }
        // If image is null/undefined, it was removed and should be excluded
      });

      // Send the list of existing images to keep
      formData.append('existingImages', JSON.stringify(existingImages));

      console.log('FormData created with:', {
        name: editingProduct.name,
        description: editingProduct.description,
        price: parseFloat(editingProduct.price),
        monthly_price: parseFloat(editingProduct.monthlyPrice),
        category: editingProduct.category,
        stock: parseInt(editingProduct.stock),
        colors: validColors,
        existingImages: existingImages.length,
        newImages: newImages.length
      });

      console.log('Sending update request for product ID:', editingProduct.id);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await productAPI.updateProduct(editingProduct.id, formData, token);
      
      console.log('Update response:', response);
      
      if (response.success) {
        setSuccessMessage('Product updated successfully!');
        // Refresh the products list
        const refreshResponse = await productAPI.getAllProducts();
        if (refreshResponse.success) {
          setProducts(refreshResponse.data || []);
        }
        setEditingProduct(null);
        setShowEditForm(false);
      } else {
        setError(response.message || 'Failed to update product');
      }
    } catch (error) {
      setError('Error updating product: ' + error.message);
    }
  };

  const handleEditColorChange = (index, value) => {
    const newColors = [...editingProduct.colors];
    newColors[index] = { ...newColors[index], name: value };
    setEditingProduct({ ...editingProduct, colors: newColors });
  };

  const handleEditColorStockChange = (index, value) => {
    const newColors = [...editingProduct.colors];
    newColors[index] = { ...newColors[index], stock: parseInt(value) || 0 };
    
    // Calculate total stock from all colors
    const totalStock = newColors.reduce((sum, color) => sum + (parseInt(color.stock) || 0), 0);
    
    setEditingProduct({ 
      ...editingProduct, 
      colors: newColors,
      stock: totalStock.toString() // Update the main stock field
    });
  };

  const handleEditImageChange = (index, file) => {
    const newImages = [...editingProduct.images];
    newImages[index] = file;
    setEditingProduct({ ...editingProduct, images: newImages });
  };

  const addEditColorField = () => {
    const newColors = [...editingProduct.colors, { name: '', stock: '' }];
    const totalStock = newColors.reduce((sum, color) => sum + (parseInt(color.stock) || 0), 0);
    
    setEditingProduct({ 
      ...editingProduct, 
      colors: newColors,
      stock: totalStock.toString()
    });
  };

  const addEditImageField = () => {
    setEditingProduct({ ...editingProduct, images: [...editingProduct.images, null] });
  };

  const removeEditImage = (index) => {
    const newImages = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, images: newImages });
  };

  const removeEditColor = (index) => {
    const newColors = editingProduct.colors.filter((_, i) => i !== index);
    const totalStock = newColors.reduce((sum, color) => sum + (parseInt(color.stock) || 0), 0);
    
    setEditingProduct({ 
      ...editingProduct, 
      colors: newColors,
      stock: totalStock.toString()
    });
  };

  const handleColorChange = (index, value) => {
    const newColors = [...newProduct.colors];
    newColors[index] = { ...newColors[index], name: value };
    setNewProduct({ ...newProduct, colors: newColors });
  };

  const handleColorStockChange = (index, value) => {
    const newColors = [...newProduct.colors];
    newColors[index] = { ...newColors[index], stock: parseInt(value) || 0 };
    
    // Calculate total stock from all colors
    const totalStock = newColors.reduce((sum, color) => sum + (parseInt(color.stock) || 0), 0);
    
    setNewProduct({ 
      ...newProduct, 
      colors: newColors,
      stock: totalStock.toString() // Update the main stock field
    });
  };

  const handleImageChange = (index, file) => {
    const newImages = [...newProduct.images];
    newImages[index] = file;
    setNewProduct({ ...newProduct, images: newImages });
  };

  const addColorField = () => {
    const newColors = [...newProduct.colors, { name: '', stock: '' }];
    const totalStock = newColors.reduce((sum, color) => sum + (parseInt(color.stock) || 0), 0);
    
    setNewProduct({ 
      ...newProduct, 
      colors: newColors,
      stock: totalStock.toString()
    });
  };

  const addImageField = () => {
    setNewProduct({ ...newProduct, images: [...newProduct.images, null] });
  };

  const removeImage = (index) => {
    const newImages = newProduct.images.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, images: newImages });
  };

  const removeColor = (index) => {
    const newColors = newProduct.colors.filter((_, i) => i !== index);
    const totalStock = newColors.reduce((sum, color) => sum + (parseInt(color.stock) || 0), 0);
    
    setNewProduct({ 
      ...newProduct, 
      colors: newColors,
      stock: totalStock.toString()
    });
  };

  return (
    <div className="admin-product-management">
      <div className="product-management-header">
        <h1>Product Management</h1>
        <button 
          className="add-product-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {showAddForm && (
        <div className="add-product-form">
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="LIVING ROOM">LIVING ROOM</option>
                  <option value="BED ROOM">BED ROOM</option>
                  <option value="KITCHEN">KITCHEN</option>
                  <option value="HALLWAY">HALLWAY</option>
                  <option value="OFFICE">OFFICE</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
                              <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
              <div className="form-group">
                <label>Stock Quantity (Auto-calculated)</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  readOnly
                  className="readonly-input"
                />
              </div>
            </div>

                          <div className="form-group">
                <label>Colors</label>
                {newProduct.colors.map((color, index) => (
                  <div key={index} className="color-stock-row">
                    <input
                      type="text"
                      placeholder="Color name"
                      value={color.name}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={color.stock}
                      onChange={(e) => handleColorStockChange(index, e.target.value)}
                      min="0"
                      required
                    />
                    {newProduct.colors.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeColor(index)} 
                        className="remove-color-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addColorField} className="add-field-btn">
                  + Add Color
                </button>
              </div>

            <div className="form-group">
              <label>Product Images</label>
              {newProduct.images.map((image, index) => (
                <div key={index} className="image-upload-container">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                  required
                    className="image-upload-input"
                  />
                  {image && (
                    <div className="image-preview">
                      <img 
                        src={image instanceof File ? URL.createObjectURL(image) : image} 
                        alt="Preview" 
                        className="preview-image"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)} 
                        className="remove-image-btn"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addImageField} className="add-field-btn">
                + Add Image
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Save Product</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
                 </div>
       )}

       {/* Edit Product Form */}
       {showEditForm && editingProduct && (
         <div className="add-product-form">
           <h2>Edit Product</h2>
           <form onSubmit={handleUpdateProduct}>
             <div className="form-row">
               <div className="form-group">
                 <label>Product Name</label>
                 <input
                   type="text"
                   value={editingProduct.name}
                   onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                   required
                 />
               </div>
               <div className="form-group">
                 <label>Category</label>
                 <select
                   value={editingProduct.category}
                   onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                   required
                 >
                   <option value="">Select Category</option>
                   <option value="LIVING ROOM">LIVING ROOM</option>
                   <option value="BED ROOM">BED ROOM</option>
                   <option value="KITCHEN">KITCHEN</option>
                   <option value="HALLWAY">HALLWAY</option>
                   <option value="OFFICE">OFFICE</option>
                 </select>
               </div>
             </div>

             <div className="form-group">
               <label>Description</label>
               <textarea
                 value={editingProduct.description}
                 onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                 required
               />
             </div>

             <div className="form-row">
                               <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    required
                  />
                </div>
               <div className="form-group">
                 <label>Stock Quantity (Auto-calculated)</label>
                 <input
                   type="number"
                   value={editingProduct.stock}
                   readOnly
                   className="readonly-input"
                 />
               </div>
             </div>

                           <div className="form-group">
                <label>Colors</label>
                {editingProduct.colors.map((color, index) => (
                  <div key={index} className="color-stock-row">
                    <input
                      type="text"
                      placeholder="Color name"
                      value={color.name}
                      onChange={(e) => handleEditColorChange(index, e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={color.stock}
                      onChange={(e) => handleEditColorStockChange(index, e.target.value)}
                      min="0"
                      required
                    />
                    {editingProduct.colors.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeEditColor(index)} 
                        className="remove-color-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addEditColorField} className="add-field-btn">
                  + Add Color
                </button>
              </div>

             <div className="form-group">
               <label>Product Images</label>
               <p className="image-help-text">Current images will be kept. Add new images to replace them.</p>
               {editingProduct.images.map((image, index) => (
                 <div key={index} className="image-upload-container">
                   <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => handleEditImageChange(index, e.target.files[0])}
                     className="image-upload-input"
                   />
                   {image && (
                     <div className="image-preview">
                       <img 
                         src={
                           image instanceof File 
                             ? URL.createObjectURL(image) 
                             : `http://localhost:5000${image}`
                         } 
                         alt="Preview" 
                         className="preview-image"
                       />
                       <button 
                         type="button" 
                         onClick={() => removeEditImage(index)} 
                         className="remove-image-btn"
                       >
                         ×
                       </button>
                     </div>
                   )}
                 </div>
               ))}
               <button type="button" onClick={addEditImageField} className="add-field-btn">
                 + Add Image
               </button>
             </div>

             <div className="form-actions">
               <button type="submit" className="save-btn">Update Product</button>
               <button 
                 type="button" 
                 onClick={() => {
                   setShowEditForm(false);
                   setEditingProduct(null);
                 }} 
                 className="cancel-btn"
               >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-list">
        <h2>Current Products</h2>
        {loading ? (
          <div className="loading-message">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products-message">
            <p>No products in the database yet.</p>
            <p>Add your first product using the "Add New Product" button above.</p>
          </div>
        ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                   <img 
                     src={
                       product.images && product.images.length > 0 
                         ? `http://localhost:5000${product.images[0]}` 
                         : '/placeholder.jpg'
                     } 
                     alt={product.name} 
                   />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                                   <p className="product-price">${parseFloat(product.price || 0).toFixed(2)}</p>
                <p className="product-stock">Stock: {product.stock}</p>
                <div className="product-actions">
                     <button 
                       className="edit-btn"
                       onClick={() => handleEditProduct(product)}
                     >
                       Edit
                     </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductManagement; 