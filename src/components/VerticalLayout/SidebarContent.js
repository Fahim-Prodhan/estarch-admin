import PropTypes from "prop-types"
import React, { useCallback, useEffect } from "react"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import withRouter from "../Common/withRouter"
import { Link, useLocation } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"

const SidebarContent = props => {
  // const ref = useRef();
  const activateParentDropdown = useCallback(item => {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      // scrollElement(item);
      return false
    }
    // scrollElement(item);
    return false
  }, [])

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement

      if (item && item.classList.contains("active")) {
        item.classList.remove("active")
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show")
        }

        parent.classList.remove("mm-active")
        const parent2 = parent.parentElement

        if (parent2) {
          parent2.classList.remove("mm-show")

          const parent3 = parent2.parentElement
          if (parent3) {
            parent3.classList.remove("mm-active") // li
            parent3.childNodes[0].classList.remove("mm-active")

            const parent4 = parent3.parentElement // ul
            if (parent4) {
              parent4.classList.remove("mm-show") // ul
              const parent5 = parent4.parentElement
              if (parent5) {
                parent5.classList.remove("mm-show") // li
                parent5.childNodes[0].classList.remove("mm-active") // a tag
              }
            }
          }
        }
      }
    }
  }

  const path = useLocation()
  const activeMenu = useCallback(() => {
    const pathName = path.pathname
    let matchingMenuItem = null
    const ul = document.getElementById("side-menu")
    const items = ul.getElementsByTagName("a")
    removeActivation(items)

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  }, [path.pathname, activateParentDropdown])

  // useEffect(() => {
  //   ref.current.recalculate();
  // }, []);

  useEffect(() => {
    new MetisMenu("#side-menu")
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    activeMenu()
  }, [activeMenu])

  // function scrollElement(item) {
  //   if (item) {
  //     const currentPosition = item.offsetTop;
  //     if (currentPosition > window.innerHeight) {
  //       ref.current.getScrollElement().scrollTop = currentPosition - 300;
  //     }
  //   }
  // }
  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            <li>
              <Link to="/dashboard" className="waves-effect">
                <i className="uil-home-alt"></i>
                <span className="badge rounded-pill bg-primary float-end">
                  01
                </span>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>

            <li className="menu-title">{props.t("Apps")}</li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="uil-store"></i>
                <span>{props.t("Ecommerce")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/ecommerce-home-element">{props.t("Home Element")}</Link>
                </li>
                <li>
                  <Link to="/ecommerce-home-view">{props.t("Home View")}</Link>
                </li>

               
                <li>
                  <Link to="/ecommerce-orders">{props.t("Orders")}</Link>
                </li>
                <li>
                  <Link to="/ecommerce-return">
                    {props.t("Return & Refund")}
                  </Link>
                </li>
                <li>
                  <Link to="/ecommerce-pos-orders">
                    {props.t("Pos Orders")}
                  </Link>
                </li>
                {/* <li>
                  <Link to="#">{props.t("Products")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Product Detail")}</Link>
                </li>

                <li>
                  <Link to="#">{props.t("Customers")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Cart")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Checkout")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Shops")}</Link>
                </li>
                <li>
                  <Link to="#">{props.t("Add Product")}</Link>
                </li> */}
              </ul>
            </li>

            {/* Purchase */}
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="uil-envelope"></i>
                <span>{props.t("Purchase")}</span>
              </Link>
              <ul className="sub-menu">
               
                <li>
                  <Link to="/add-purchase">{props.t("Add Purchase")} </Link>
                </li>
                <li>
                  <Link to="/purchase-list">{props.t("Purchase List")} </Link>
                </li>
              </ul>
            </li>

            {/* Supply */}
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="uil-envelope"></i>
                <span>{props.t("Supply")}</span>
              </Link>
              <ul className="sub-menu">
             
                <li>
                  <Link to="/add-supplier">{props.t("Add Supplier")} </Link>
                </li>
              </ul>
            </li>

            {/* Expense */}
            {/* <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="uil-envelope"></i>
                <span>{props.t("Expense")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/expense-head">{props.t("Expense Head")}</Link>
                </li>
                <li>
                  <Link to="/create-expense">{props.t("Create Expense")} </Link>
                </li>
                <li>
                  <Link to="/expense-list">{props.t("Expense List")} </Link>
                </li>
              </ul>
            </li> */}


            <li className="menu-title">{props.t("Product")}</li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="uil-envelope"></i>
                <span>{props.t("Product")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/ecommerce-add-product">
                    {props.t("Create Product")}
                  </Link>
                </li>
                <li>
                  <Link to="/product-list">{props.t("Product List")} </Link>
                </li>
                <li>
                  <Link to="/ecommerce-product-serial">{props.t("Product Serial")} </Link>
                </li>
                <li>
                  <Link to="/ecommerce-category-serial">{props.t("Category Serial")} </Link>
                </li>
                <li>
                  <Link to="/ecommerce-subcategory-serial">{props.t("Subcategory Serial")} </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="uil-envelope"></i>
                <span>{props.t("Category")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/ecommerce-add-type">{props.t("Add Type")}</Link>
                </li>
                <li>
                  <Link to="/ecommerce-add-category">{props.t("Add Category")}</Link>
                </li>
                <li>
                  <Link to="/ecommerce-add-subcategory">{props.t("Add sub-Category")}</Link>
                </li>
                <li>
                  <Link to="/ecommerce-add-brand">{props.t("Add Brand")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="uil-envelope"></i>
                <span>{props.t("Attribute")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/main-attribute">{props.t("Main Attribute")}</Link>
                </li>
                
                <li>
                  <Link to="/ecommerce-add-size-type">{props.t("Add Size Type")}</Link>
                </li>
                <li>
                  <Link to="/ecommerce-add-size">{props.t("Add Size")}</Link>
                </li>
              </ul>
            </li>

            {/* <li>
              <li>
                <Link to="/brand">{props.t("Brand")}</Link>
              </li>
            </li> */}

            <li className="menu-title">Pages</li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="uil-user-circle"></i>
                <span>{props.t("Authentication")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/pages-register">{props.t("Register-Admin")}</Link>
                </li>
                {/* <li>
                  <Link to="/pages-login">{props.t("Login")}</Link>
                </li>
                <li>
                  <Link to="/page-recoverpw">
                    {props.t("Recover Password")}
                  </Link>
                </li>
                <li>
                  <Link to="/auth-lock-screen">{props.t("Lock Screen")}</Link>
                </li> */}
              </ul>
            </li>
            
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
