import React from "react"
import { Navigate } from "react-router-dom"

// Dashboard
import Dashboard from "../pages/Dashboard/index"


//Pages
import PagesStarter from "../pages/Utility/pages-starter"
import PagesMaintenance from "../pages/Utility/pages-maintenance"
import PagesComingsoon from "../pages/Utility/pages-comingsoon"
import Pages404 from "../pages/Utility/pages-404"
import Pages500 from "../pages/Utility/pages-500"


// E-commerce Pages
import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index"
import EcommerceReturn from "../pages/Ecommerce/EcommerceReturn/index"

// Purchase Pages
import PurchaseCreate from "../pages/Purchase/PurchaseCreate/index"
import PurchaseList from "../pages/Purchase/PurchaseList/index"

// supply pages
import AddSupply from "../pages/Supply/AddSupply/index"
import SupplyList from "../pages/Supply/SupplyList/index"

// Expense Pages
import ExpenseHead from "../pages/Expense/ExpenseHead/index"
import CreateExpense from "../pages/Expense/CreateExpense/index"
import ExpenseList from "../pages/Expense/ExpenseList/index"

// Product Page
import ProductList from '../pages/Product/ProductList/index'
import AddProduct from "../pages/Product/AddProduct/index"


// Category Pages
import CreateCategory from "../pages/Category/CreateCategory/index"
import CategoryList from "../pages/Category/CategoryList/index"

// Attribute Pages
import MainAttribute from "../pages/Attribute/MainAttribute/index"
import AttributeValue from "../pages/Attribute/AttributeValue/index"

// brand Page
import Brand from "../pages/Brand/index"

// barcode Print page
import BarcodeDisplay from "../pages/Product/BarcodeDisplay/index"



// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

//  // Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login"
import Register1 from "../pages/AuthenticationInner/Register"
import Recoverpw from "../pages/AuthenticationInner/Recoverpw"
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"
import AddCategory from "../pages/Ecommerce/AddCategory"
import AddSubCategory from "../pages/Ecommerce/AddSubCategory"
import AddBrand from "../pages/Ecommerce/AddBrand"
import AddType from "../pages/Ecommerce/AddType"
import AddSizeType from "../pages/Ecommerce/AddSizeType"
import AddSize from "../pages/Ecommerce/AddSize"
import InvoicesDetail from "../pages/Invoices/invoices-detail"
import ChartBuilder from "../pages/Ecommerce/EcommerceChartBuilder"
import AddSizeChart from "../pages/Ecommerce/AddSizeChart"


const userRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  // E-commerce Routes
  { path: "/ecommerce-orders", component: <EcommerceOrders/> },
  { path: "/ecommerce-return", component: <EcommerceReturn/> },
  { path: "/ecommerce-add-category", component: <AddCategory/> },
  { path: "/ecommerce-add-subcategory", component: <AddSubCategory/> },
  { path: "/ecommerce-add-brand", component: <AddBrand/> },
  { path: "/ecommerce-add-type", component: <AddType/> },
  { path: "/ecommerce-add-size-type", component: <AddSizeType/> },
  { path: "/ecommerce-add-size", component: <AddSize/> },
  { path: "/ecommerce-chart-builder", component: <ChartBuilder/> },


  // Purchase Routes
  { path: "/create-purchase", component: <PurchaseCreate/> },
  { path: "/purchase-list", component: <PurchaseList/> },

  // supply Routes
  { path: "/add-supply", component: <AddSupply/> },
  { path: "/supply-list", component: <SupplyList/> },
  
  // Expense Routes
  { path: "/expense-head", component: <ExpenseHead/> },
  { path: "/create-expense", component: <CreateExpense/> },
  { path: "/expense-list", component: <ExpenseList/> },
  
  // Product Routes
  { path: "/product-list", component: <ProductList/> },
  { path: "/ecommerce-add-product", component: <AddProduct/> },

  
  
  
  // Category Routes
  { path: "/create-category", component: <CreateCategory/> },
  { path: "/category-list", component: <CategoryList/> },
  
  // Attribute Routes
  { path: "/main-attribute", component: <AddSizeChart/> },
  { path: "/attribute-values", component: <AttributeValue/> },
  
  // brand routes
  { path: "/brand", component: <Brand/> },
  
  // authentication
  { path: "/pages-register", component: <Register1/> },
  
  { path: "/invoice/:id", component: <InvoicesDetail/> },

  


  //Utility
  { path: "/pages-starter", component: <PagesStarter/> },

  
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const authRoutes = [

  { path: "/logout", component: <Logout/> },
  { path: "/login", component: <Login/> },
  { path: "/forgot-password", component: <ForgetPwd/> },
  // { path: "/register", component: <Register/> },

  { path: "/pages-maintenance", component: <PagesMaintenance/> },
  { path: "/pages-comingsoon", component: <PagesComingsoon/> },
  { path: "/pages-404", component: <Pages404/> },
  { path: "/pages-500", component: <Pages500/> },

  // Authentication Inner
  { path: "/pages-login", component: <Login1/> },
  // { path: "/pages-register", component: <Register1/> },
  { path: "/page-recoverpw", component: <Recoverpw/> },
  { path: "/auth-lock-screen", component: <LockScreen/> },
  { path: "/barcode-display", component: <BarcodeDisplay/> },
]

export { userRoutes, authRoutes }