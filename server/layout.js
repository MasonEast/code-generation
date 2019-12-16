
        
        import React from 'react'
        import { connect } from 'react-redux'
        import Layout from '@/components/layout'
        const {Header, Side, Content, Footer} = Layout
    
        const Cmp = () => {
            return (<Layout><Header >header</Header>
<Content >Content</Content>
<Footer >footer</Footer></Layout>)
        }
        export default Cmp
    