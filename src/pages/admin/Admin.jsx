import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../admin/home/Home'
import ViewProducts from '../admin/viewProducts/ViewProducts'
import AddProduct from './addproduct/AddProduct'
import Orders from './orders/Orders'
import styles from './admin.module.scss'
import Navbar from './navbar/Navbar'
import AdminOrderDetails from './adminOrderDetails/AdminOrderDetails'
import Users from './users/Users'
import DeletedUsers from './deletedUsers/DeletedUsers'

export default function Admin() {
  return (
    <div className={styles.admin}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path='home' element={<Home />} />
          <Route path='all-products' element={<ViewProducts />} />
          <Route path='add-product/:id' element={<AddProduct />} />
          <Route path='orders' element={<Orders />} />
          <Route path='/order-details/:id' element={<AdminOrderDetails />} />
          <Route path='users' element={<Users />} />
          <Route path='deleted-users' element={<DeletedUsers />} />
          <Route />
        </Routes>
      </div>
    </div>
  )
}
