import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AiOutlineArrowLeft } from "react-icons/ai";
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form, PageHeader } from "antd";
import myStyles from '../styles/MyComponent.module.css'

const CreateParty: NextPage = () => {
  const router = useRouter();
  const clickCreate = () =>{
    router.back();
  }
  return(
    <>
    <PageHeader
        className="site-page-header"
        // title="ปาร์ตี้ทั้งหมด"
        style={{
          'backgroundColor': '#1d004f',
        }}
        children={
        <>
        <div style={{'display':'flex', 'alignItems' : 'center', 'justifyContent': 'center'}}>
            <div style={{'position': 'absolute', 'left': 0, 'marginLeft': 10}}>
                <AiOutlineArrowLeft color='white' onClick={() => router.back()} size='30'/>
            </div>
          <div style={{'margin' : 'auto'}}>
            <p style={{'color': 'white', 'textAlign': 'center', 'fontSize': 20, 'marginBottom': 0}}>สร้างปาร์ตี้</p>
          </div>
        </div>
        </>
        }
      />

      <div className={styles.container}>
    <main className={styles.main}>
      <div>
        <div>
          <Input className={myStyles.cspan} size='large' placeholder='ชื่อปาร์ตี้'></Input>
        </div>
        <div>
        <Input className={myStyles.cspan} size='large' placeholder='จำนวนคนที่ขาด'></Input>
        </div>
      </div>
      <div>
        <div>
          <Button className={`${myStyles.cspan} ${myStyles.cbutton}`} type="primary" onClick={() => clickCreate()}>สร้างปาร์ตี้</Button>
        </div>
      </div>
    </main>
  </div>
  </>
  )
}

export default CreateParty