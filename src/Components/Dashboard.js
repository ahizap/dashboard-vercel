import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const initialData = [
  {
    id: "1774",
    name: "CSPM Executive Dashboard",
    buttons: [
      {
        text: "Widget1",
        image:
          "https://cdn1.iconfinder.com/data/icons/miscellaneous-4/32/dashboard-medium-1024.png",
      },
      {
        text: "Widget2",
        image:
          "https://storage.googleapis.com/blogs-images/ciscoblogs/1/2021/10/Predictive-analytics-2.png",
      },
    ],
  },
  {
    id: "785f",
    name: "CWPP Dashboard",
    buttons: [
      {
        text: "Widget1",
        image: "https://cdn4.iconfinder.com/data/icons/reports-and-analytics-2/512/89-512.png",
      },
      {
        text: "Widget2",
        image: "https://komunigrafik.com/assets/all/img/showcase/zohobis/icon-hr-dashboard.png",
      },
    ],
  },
  {
    id: "05d1",
    name: "Registry Scan",
    buttons: [
      {
        text: "Widget1",
        image: "https://avatars.mds.yandex.net/i?id=3ed63176091581ae161646356c703daf9e0cf63c-9245612-images-thumbs&n=13",
      },
      {
        text: "Widget2",
        image: "https://avatars.mds.yandex.net/i?id=d17e35a4e1d74e0a55342b45280fba50ab61fdd6-10146075-images-thumbs&ref=rim&n=33&w=347&h=200",
      },
    ],
  },
];

const Dashboard = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isAddCategoryOverlayVisible, setAddCategoryOverlayVisible] =
    useState(false);
  const [categories, setCategories] = useState([]);
  const [newButton, setNewButton] = useState({
    text: "",
    image: "",
    category: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Initialize with provided data if nothing is in localStorage
      saveCategoriesToLocalStorage(initialData);
    }
  };

  const saveCategoriesToLocalStorage = (categories) => {
    localStorage.setItem("categories", JSON.stringify(categories));
    setCategories(categories);
  };

  const showOverlay = () => setOverlayVisible(true);
  const hideOverlay = () => setOverlayVisible(false);
  const showAddCategoryOverlay = () => setAddCategoryOverlayVisible(true);
  const hideAddCategoryOverlay = () => setAddCategoryOverlayVisible(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewButton({ ...newButton, [name]: value });
  };

  const handleAddButton = () => {
    if (!newButton.category) {
      alert("Please select a category before adding a button.");
      return;
    }

    const categoryIndex = categories.findIndex(
      (cat) => cat.name === newButton.category
    );
    let updatedCategories = [...categories];

    if (categoryIndex === -1) {
      updatedCategories.push({
        name: newButton.category,
        buttons: [{ text: newButton.text, image: newButton.image }],
      });
    } else {
      updatedCategories[categoryIndex].buttons.push({
        text: newButton.text,
        image: newButton.image,
      });
    }

    saveCategoriesToLocalStorage(updatedCategories);
    setNewButton({ text: "", image: "", category: "" });
    hideOverlay();
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert("Please enter a category name.");
      return;
    }

    const newCategories = [...categories, { name: newCategory, buttons: [] }];
    saveCategoriesToLocalStorage(newCategories);
    setNewCategory("");
    hideAddCategoryOverlay();
  };

  const handleRemoveButton = (categoryName, buttonIndex) => {
    const updatedCategories = categories
      .map((category) => {
        if (category.name === categoryName) {
          const updatedButtons = category.buttons.filter(
            (_, index) => index !== buttonIndex
          );
          return { ...category, buttons: updatedButtons };
        }
        return category;
      })
      .filter((category) => category.buttons.length > 0);

    saveCategoriesToLocalStorage(updatedCategories);
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      buttons: category.buttons.filter((button) =>
        button.text.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.buttons.length > 0);

  return (
    <div className="dashboard">
      <div className="dashboard-controls">
        <button onClick={showOverlay} className="add-button">
          Add Widget
        </button>
        <button onClick={showAddCategoryOverlay} className="add-button">
          Add Category
        </button>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search widgets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="categories-list">
        {filteredCategories
          .filter(
            (category) =>
              !selectedCategory || category.name === selectedCategory
          )
          .map((category) => (
            <div key={category.name} className="category">
              <h2>{category.name}</h2>
              <div className="button-grid">
                {category.buttons.map((button, index) => (
                  <div key={index} className="custom-button">
                    {button.image && (
                      <img src={button.image} alt={button.text} />
                    )}
                    <p>{button.text}</p>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveButton(category.name, index)}
                    >
                      &#x2715;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {isOverlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Add New Widget</h2>
            <button className="close-overlay" onClick={hideOverlay}>
              &#x2715;
            </button>
            <input
              type="text"
              name="text"
              value={newButton.text}
              onChange={handleInputChange}
              placeholder="Widget Text"
            />
            <input
              type="text"
              name="image"
              value={newButton.image}
              onChange={handleInputChange}
              placeholder="Image URL (optional)"
            />
            <select
              name="category"
              value={newButton.category}
              onChange={handleInputChange}
              className="category-select"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button className="add-button-overlay" onClick={handleAddButton}>
              Add Widget
            </button>
          </div>
        </div>
      )}

      {isAddCategoryOverlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Add New Category</h2>
            <button className="close-overlay" onClick={hideAddCategoryOverlay}>
              &#x2715;
            </button>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category Name"
            />
            <button className="add-button" onClick={handleAddCategory}>
              Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
