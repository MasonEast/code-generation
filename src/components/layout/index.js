import Footer from './footer'
import Header from './header'
import Content from './main'
import Side from './side'
import Section from './section'
import React from 'react'
import './index.less'

const Layout = ({ children }) => <div className="layout-box">{children}</div>

Layout.Header = Header
Layout.Footer = Footer
Layout.Content = Content
Layout.Side = Side
Layout.Section = Section

export default Layout