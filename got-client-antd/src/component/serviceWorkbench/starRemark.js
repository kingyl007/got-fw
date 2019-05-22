import React, {Component} from 'react';

/**
 * 五星点评组件
 */
class StarRemark extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.name);
        this.state={
            //接到页面传过来的值
            num:this.props.name,
            //根据页面当中的星星的数量来设置默认值
            arr:[1,2,3,4,5]
        }
    }

    render(){
        return(

            <span>
                {
                    this.state.arr.map((ele,index)=>{
                        return(
                            <span key={index}>
                                {ele>this.state.num?<span style={{color:"#CCCCCC",fontSize:"12px"}}>★</span>:<span style={{color:"#FFAC2D",fontSize:"12px"}}>★</span>}
                            </span>
                        )
                    })
                }
            </span>
        )
    }
}
export default StarRemark;