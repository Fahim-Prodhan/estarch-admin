import React, { useState } from "react";
import { IoPlayBackCircleSharp } from "react-icons/io5";
import Modal from "./modal";
import { BsArrowsFullscreen } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import { Link } from "react-router-dom";
const PosOrders = () => {
  document.title = "Estarch | Pos Orders"
  const [quantity, setQuantity] = useState(1);
  const price = 850;

  const handleQuantityChange = (increment) => {
    setQuantity(quantity + increment);
  };

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  return (
    <React.Fragment>
      <div className="mt-2">
        <main className=" min-h-screen bg-slate-50">
          <div className="flex">
            <div className="w-5/12 flex  items-center flex-col px-3">
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="">
                  <details className="dropdown w-full">
                    <summary className="btn bg-white  w-full  border flex justify-between  ">Brand <span><MdArrowDropDown /></span></summary>
                    <ul className="menu w-full  dropdown-content bg-base-100 rounded-box z-[1] p-1 shadow">
                      <li><input type="text" placeholder="Type here" className="input h-8 w-full input-bordered  rounded-sm" /></li>
                      <li>Searching..</li>
                      <li>polo</li>
                    </ul>
                  </details>
                </div>
                <div className="">
                  <details className="dropdown w-full">
                    <summary className="btn w-full bg-white border flex justify-between  ">Category <span><MdArrowDropDown /></span></summary>
                    <ul className="menu w-full  dropdown-content bg-base-100 rounded-box z-[1] p-1 shadow">
                      <li><input type="text" placeholder="Type here" className="input h-8 w-full input-bordered  rounded-sm" /></li>
                      <li>Searching..</li>
                      <li>polo</li>
                    </ul>
                  </details>
                </div>
                <div className="">
                  <details className="dropdown w-full">
                    <summary className="btn w-full bg-white  border flex justify-between  ">Sub Category <span><MdArrowDropDown /></span></summary>
                    <ul className="menu w-full  dropdown-content bg-base-100 rounded-box z-[1] p-1 shadow">
                      <li><input type="text" placeholder="Type here" className="input h-8 w-full input-bordered  rounded-sm" /></li>
                      <li>Searching..</li>
                      <li>polo</li>
                    </ul>
                  </details>
                </div>
                <div className="">
                  <input type="text" placeholder="Enter Product name / SKU" className="input input-bordered w-full max-w-xs" />
                </div>

              </div>
              <div className="grid grid-cols-4 gap-2">


              </div>
            </div>
            <div className="w-7/12 bg-white">
              <div className="  ">
                <div className="container mx-auto px-4 py-2">
                  <div className="grid grid-cols-3 gap-1 mb-1 ">
                    <input
                      type="text"
                      placeholder="Enter Phone Number"
                      className="border p-2 rounded "
                    />
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="border p-2 rounded "
                    />
                    <input
                      type="text"
                      placeholder="Enter Address"
                      className="border p-2 rounded "
                    />
                  </div>
                  <p className="px-4">user found <span className="text-green-500 font-medium">success rate 100%</span> <span className="underline cursor-pointer">(see order list)</span></p>
                  <table className="min-w-full bg-white px-4">
                    <thead className="bg-green-500 text-white">
                      <tr>
                        <th className=" px-4 py-2">Name</th>
                        <th className=" px-4 py-2">Price</th>
                        <th className=" px-4 py-2">Disc(%)</th>
                        <th className=" px-4 py-2">Disc Amt</th>
                        <th className=" px-4 py-2">After Disc</th>
                        <th className=" px-4 py-2">Qty</th>
                        <th className=" px-4 py-2">Total</th>
                        <th className=" px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody >

                      <tr >
                        <td className="border px-4 py-2 text-[13px]">
                          100% PK Cotton Summer Polo (7)
                          <br />
                          Barcode: 68598458 XL
                        </td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2 flex items-center">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="bg-red-500 text-white px-2"
                          >
                            -
                          </button>
                          <span className="mx-2">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            className="bg-green-500 text-white px-2"
                          >
                            +
                          </button>
                        </td>
                        <td className="border px-4 py-2">{price * quantity}</td>
                        <td className="border px-4 py-2 text-center">
                          <button className="text-red-500">🗑️</button>
                        </td>
                      </tr>
                      <tr >
                        <td className="border px-4 py-2 text-[13px]">
                          100% PK Cotton Summer Polo (7)
                          <br />
                          Barcode: 68598458 XL
                        </td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2 flex items-center">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="bg-red-500 text-white px-2"
                          >
                            -
                          </button>
                          <span className="mx-2">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            className="bg-green-500 text-white px-2"
                          >
                            +
                          </button>
                        </td>
                        <td className="border px-4 py-2">{price * quantity}</td>
                        <td className="border px-4 py-2 text-center">
                          <button className="text-red-500">🗑️</button>
                        </td>
                      </tr>
                      <tr >
                        <td className="border px-4 py-2 text-[13px]">
                          100% PK Cotton Summer Polo (7)
                          <br />
                          Barcode: 68598458 XL
                        </td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2 flex items-center">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="bg-red-500 text-white px-2"
                          >
                            -
                          </button>
                          <span className="mx-2">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            className="bg-green-500 text-white px-2"
                          >
                            +
                          </button>
                        </td>
                        <td className="border px-4 py-2">{price * quantity}</td>
                        <td className="border px-4 py-2 text-center">
                          <button className="text-red-500">🗑️</button>
                        </td>
                      </tr>
                      <tr >
                        <td className="border px-4 py-2 text-[13px]">
                          100% PK Cotton Summer Polo (7)
                          <br />
                          Barcode: 68598458 XL
                        </td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2 flex items-center">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="bg-red-500 text-white px-2"
                          >
                            -
                          </button>
                          <span className="mx-2">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            className="bg-green-500 text-white px-2"
                          >
                            +
                          </button>
                        </td>
                        <td className="border px-4 py-2">{price * quantity}</td>
                        <td className="border px-4 py-2 text-center">
                          <button className="text-red-500">🗑️</button>
                        </td>
                      </tr>
                      <tr >
                        <td className="border px-4 py-2 text-[13px]">
                          100% PK Cotton Summer Polo (7)
                          <br />
                          Barcode: 68598458 XL
                        </td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">{price}</td>
                        <td className="border px-4 py-2 flex items-center">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="bg-red-500 text-white px-2"
                          >
                            -
                          </button>
                          <span className="mx-2">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            className="bg-green-500 text-white px-2"
                          >
                            +
                          </button>
                        </td>
                        <td className="border px-4 py-2">{price * quantity}</td>
                        <td className="border px-4 py-2 text-center">
                          <button className="text-red-500">🗑️</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex justify-center mt-1">
                    <button className="btn btn-sm w-32 bg-red-600 hover:bg-red-600 text-white font-medium">Clear</button>
                  </div>
                  <div className="mt-14">
                    <div className="flex justify-between">
                      <span>Items</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>{price * quantity}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-black px-4 text-white grid grid-cols-2 gap-5 p-2">
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>After Discount Price</span>
                    <span>{price * quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total VAT</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Payable</span>
                    <span>{price * quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0">
            <div className="mt-3 flex text-center ">
              <div className="bg-[#605ca8] w-7/12 flex justify-evenly">
                <div className="flex items-center h-full justify-evenly gap-10">
                  <Link to='/'><IoPlayBackCircleSharp className="text-4xl  text-white" /></Link>
                  <button
                    type="button"
                    onClick={() => {
                      toggleFullscreen();
                    }}
                    className="header-item noti-icon waves-effect text-white"
                    data-toggle="fullscreen"
                  >
                    <BsArrowsFullscreen className="text-4xl  text-white"/>
                  </button>
                </div>

                <p className="text-4xl font-bold py-4 text-white">
                  Total : -900.00 TK
                </p>
              </div>
              <div className="bg-[#188ae2] w-2/12" onClick={() => document.getElementById('my_modal_3').showModal()}>
                <p className="text-4xl font-bold py-4 text-white">
                  Exchange
                </p>
              </div>

              <dialog id="my_modal_3" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <Modal />
                </div>
              </dialog>
              <div className="bg-[#c1793c] w-1/12">
                <p className="text-4xl font-bold py-4 text-white">
                  :::
                </p>
              </div>
              <div className="bg-[#ff890f] w-1/12">
                <p className="text-4xl font-bold py-4 text-white">
                  Hold
                </p>
              </div>
              <div className="bg-[#f31250] w-1/12">
                <p className="text-4xl font-bold py-4 text-white">
                  Clear
                </p>
              </div>
              <div className="bg-[#00a65a] w-2/12">
                <p className="text-4xl font-bold py-4 text-white">
                  Payment
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default PosOrders;