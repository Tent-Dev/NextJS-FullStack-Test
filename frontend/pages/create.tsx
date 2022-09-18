import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AiOutlineArrowLeft } from "react-icons/ai";
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form, PageHeader } from "antd";
import myStyles from '../styles/MyComponent.module.css'
import HeaderBar from '../components/header';
import { useState } from 'react'

const CreateParty: NextPage = () => {
  const [loadings, setLoadings] = useState([]);
  const router = useRouter();


  const clickCreate = async () =>{
    await enterLoading(0);

    setTimeout(() =>{
      router.back();
     }, 6000)

  }

  const enterLoading = async (index: number) => {

    setLoadings((prevLoadings) => {
      const newLoadings: any = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings: any = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);

  };

  return(
    <>
      <HeaderBar headerText='สร้างปาร์ตี้' backBtn={true}/>

      <div className={styles.container}>
    <main className={styles.main}>
    <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={() => clickCreate()}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
      <div>
        <div>
          <Form.Item
            name="partyname"
            rules={[
              {
                required: true,
                message: 'โปรดกรอกชื่อปาร์ตี้',
              },
            ]}
          >
            <Input className={myStyles.cspan} size='large' placeholder='ชื่อปาร์ตี้'></Input>
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="maxguests"
            rules={[
              {
                required: true,
                message: 'โปรดกรอกจำนวนคนที่ขาด',
              },
            ]}
          >
            <Input className={myStyles.cspan} size='large' placeholder='จำนวนคนที่ขาด'></Input>
          </Form.Item>
        </div>
      </div>
      <div>
        <div>
          <Button
            htmlType="submit"
            className={`${myStyles.cspan} ${myStyles.cbutton}`}
            type="primary"
            loading={loadings[0]}
          >
            สร้างปาร์ตี้
          </Button>
        </div>
      </div>
      </Form>
    </main>
  </div>
  </>
  )
}

export default CreateParty