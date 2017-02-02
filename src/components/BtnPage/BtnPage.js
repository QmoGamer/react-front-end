import React from 'react'
import styles from './BtnPage.css'
import { Link } from 'react-router'

function BtnPage(props) {

  const { page, total_page, path } = props
  
  let start_btn = 1
  let end_btn = total_page
  let array = []
  let offset = 3

  if( total_page > ((offset * 2) + 1) ) {

    //page < offset 
    if( page <= ( offset + 1 ) ) {
      end_btn = 7
    }
    else if ( total_page < ( page + offset ) ) {
      start_btn = ( total_page - (offset * 2) )
    }
    else {
      start_btn = ( page - offset )
      end_btn = ( page + offset )
    }
  }
  
  for( let i = start_btn; i <= end_btn; i++ ) {
    array.push(i)
  }

  let render = array.map((x, y)=>{
    let css = x == page ? styles.active : null
    return <Link to={path+"/"+x} key={"btn_page_"+y} className={ styles.btn_page + " " + css }>{x}</Link>
    // return <a href={"/"+list_type+"/"+x} key={"btn_page_"+y} className={ styles.btn_page + " " + css }>{x}</a>
  })

  return <div className="rows_btn_type1">{render}</div>
}

export default BtnPage