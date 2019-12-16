
        
        import React from 'react'
        import { connect } from 'react-redux'
        import Layout from '@/components/layout'
        const {Header, Side, Content, Footer} = Layout
    
        const Cmp = () => {
            return (<Layout.Section><Side className="layout-side">side</Side>
<Layout className="layout-box"><Content >Content</Content>
<Footer >footer</Footer></Layout></Layout.Section>)
        }
        export default Cmp
    