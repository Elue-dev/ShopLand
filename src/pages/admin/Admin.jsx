import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../admin/home/Home'
import ViewProducts from '../admin/viewProducts/ViewProducts'
import AddProduct from './addproduct/AddProduct'
import Orders from './orders/Orders'
import styles from './admin.module.scss'
import Navbar from './navbar/Navbar'

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
          <Route />
        </Routes>
      </div>
    </div>
  )
}
