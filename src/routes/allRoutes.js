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
import EcommerceManageOrders from "../pages/Ecommerce/ManageOrders/index"
import EcommerceReturn from "../pages/Ecommerce/EcommerceReturn/index"
import ShowroomProfit from "../pages/Ecommerce/ShowroomProfit/ShowroomProfit.js"

// Purchase Pages
import AddPurchase from "../pages/Purchase/AddPurchase"
import PurchaseList from "../pages/Product/PurchaseList/index.js"
import AddProductAssetPurchase from "../pages/Purchase/AddAssetPurchase/index.js"

// supply pages


// Expense Pages
import ExpenseHead from "../pages/Expense/ExpenseHead/index"
import CreateExpense from "../pages/Expense/CreateExpense/index"
import ExpenseList from "../pages/Expense/ExpenseList/index"

// Product Page
import ProductList from '../pages/Product/ProductList/index'
import ProductStock from '../pages/Product/ProductStock/index'
import AddProduct from "../pages/Product/AddProduct/index"
import ManufactureProduct from "../pages/Product/ManufactureProduct/index.js"
import ManufactureProductList from "../pages/Product/ManufactureProductList/index.js"
import ProductSerial from "../pages/Product/ProductSerial/index"
import CategorySerial from "../pages/Product/CategorySerial/index"
import SubcategorySerial from "../pages/Product/SubcategorySerial/index"

// asset
import AddProductAsset from "../pages/Asset/AddAsset/Index.js"
import AddOthersAsset from "../pages/Asset/AddOthersAsset"



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

// accounts
import MainAccounts from "../pages/Accounts/MainAccount/index.js"
import InvestorAccount from "../pages/Accounts/InvestorAccount/index.js"
import MyInvestorAccount from "../pages/Accounts/MyInvestorAccount/index.js"

// Courier
import CourierApi from '../pages/Courier/CourierApi/index.js'



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
import HomeElement from "../pages/Ecommerce/HomeElement"
import HomeView from "../pages/Ecommerce/HomeView"
import EditProduct from "../pages/Product/EditProduct"
import AddSupplier from "../pages/Supply/addSupplier"
import PaymentOption from "../pages/PaymentOption/AddPayment"
import ViewPaymentOption from "../pages/PaymentOption/ViewPaymentOption"
import EditPayment from "../pages/PaymentOption/EditPayment"
import CourierAccount from "../pages/Courier/CourierAccount/index.js"



const userRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  // E-commerce Routes
  { path: "/ecommerce-home-element", component: <HomeElement /> },
  { path: "/ecommerce-home-view", component: <HomeView /> },
  { path: "/ecommerce-orders", component: <EcommerceOrders /> },
  { path: "/showroom-profit", component: <ShowroomProfit /> },
  { path: "/manage-orders/:id", component: <EcommerceManageOrders /> },
  { path: "/ecommerce-return", component: <EcommerceReturn /> },
  { path: "/ecommerce-add-category", component: <AddCategory /> },
  { path: "/ecommerce-add-subcategory", component: <AddSubCategory /> },
  { path: "/ecommerce-add-brand", component: <AddBrand /> },
  { path: "/ecommerce-add-type", component: <AddType /> },
  { path: "/ecommerce-add-size-type", component: <AddSizeType /> },
  { path: "/ecommerce-add-size", component: <AddSize /> },
  { path: "/ecommerce-chart-builder", component: <ChartBuilder /> },


  // Purchase Routes
  { path: "/add-purchase", component: <AddPurchase /> },
  { path: "/add-product-asset-purchase", component: <AddProductAssetPurchase /> },
  { path: "/purchase-list", component: <PurchaseList /> },

  // payment Routes
  { path: "/ecommerce-Payment-Option", component: <PaymentOption /> },
  { path: "/ecommerce-Payment-Option/:id", component: <EditPayment /> },
  { path: "/ecommerce-Payment-Option-view", component: <ViewPaymentOption /> },

  // supply Routes

  { path: "/add-supplier", component: <AddSupplier /> },

  // Expense Routes
  { path: "/expense-head", component: <ExpenseHead /> },
  { path: "/create-expense", component: <CreateExpense /> },
  { path: "/expense-list", component: <ExpenseList /> },

  // Product Routes
  { path: "/product-list", component: <ProductList /> },
  { path: "/ecommerce-add-product", component: <AddProduct /> },
  { path: "/ecommerce-manufacture-product", component: <ManufactureProduct /> },
  { path: "/ecommerce-manufacture-product-list", component: <ManufactureProductList /> },
  { path: "/ecommerce-edit-product/:id", component: <EditProduct /> },
  { path: "/ecommerce-product-serial", component: <ProductSerial /> },
  { path: "/ecommerce-category-serial", component: <CategorySerial /> },
  { path: "/ecommerce-subcategory-serial", component: <SubcategorySerial /> },
  { path: "/ecommerce-product-stock", component: <ProductStock /> },

  // add asset
  { path: "/add-product-asset", component: <AddProductAsset /> },
  { path: "/add-others-asset", component: <AddOthersAsset /> },


  // Category Routes
  { path: "/create-category", component: <CreateCategory /> },
  { path: "/category-list", component: <CategoryList /> },


  // Attribute Routes
  { path: "/main-attribute", component: <AddSizeChart /> },
  { path: "/attribute-values", component: <AttributeValue /> },

  // brand routes
  { path: "/brand", component: <Brand /> },

  // Accounts
  { path: "/accounts/main-accounts", component: <MainAccounts /> },
  { path: "/accounts/investor-accounts", component: <InvestorAccount /> },
  { path: "/accounts/my-investor-accounts", component: <MyInvestorAccount /> },

  // Courier
  { path: "/courier-api", component: <CourierApi /> },
  { path: "/courier-account", component: <CourierAccount/>  },


  // authentication
  { path: "/pages-register", component: <Register1 /> },
  { path: "/invoice/:id", component: <InvoicesDetail /> },




  //Utility
  { path: "/pages-starter", component: <PagesStarter /> },


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

  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  // { path: "/register", component: <Register/> },

  { path: "/pages-maintenance", component: <PagesMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },

  // Authentication Inner
  { path: "/pages-login", component: <Login1 /> },
  // { path: "/pages-register", component: <Register1/> },
  { path: "/page-recoverpw", component: <Recoverpw /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/barcode-display", component: <BarcodeDisplay /> },
]

export { userRoutes, authRoutes }