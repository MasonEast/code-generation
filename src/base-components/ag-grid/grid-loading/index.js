/**
 * @Author: chenshizhong
 * @Date: 2019/08/15 14:41:31
 * @Description: loading
 */
import React from 'react';
import './index.less';

export default ({loading,style})=>{
        return(
            <div style={{display:loading?'inline-block':'none'}}>
                <div className="ag-grid-loading" style={style}></div>
                <div className="ag-grid-loading-animate" >
                    <span className="spin-dot">
                        <i className="spin-dot-item"></i>
                        <i className="spin-dot-item"></i>
                        <i className="spin-dot-item"></i>
                        <i className="spin-dot-item"></i>
                    </span>
                </div>
            </div>
        )
}


