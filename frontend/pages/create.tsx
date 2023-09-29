import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AiOutlineArrowLeft } from "react-icons/ai";
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form, PageHeader, InputNumber } from "antd";
import myStyles from '../styles/MyComponent.module.css'
import HeaderBar from '../components/header';
import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { connect } from "react-redux";
import _ from 'lodash';
import UserService from '../services/user.service';

const CreateParty: NextPage = (props: any) => {
  const [loadings, setLoadings] = useState([]);
  const router = useRouter();
  const descRef = useRef('');
  const maxguestsRef = useRef(0);

  const onDescChange = (e: { target: { value: string } }) =>{
    descRef.current = e.target.value
  }

  const onMaxguestChange = (e: { target: { value: string } }) =>{
    maxguestsRef.current = parseInt(e.target.value)
  }

  useEffect(() =>{
    
    if(!_.has(props.post.users, 'user')){
      router.push('/');
    }
    
},[])

  const clickCreate = async () =>{

    type createPartyObj = {
      description: string,
      maxguests: Number,
      creatorId: Number
  }

    let params: createPartyObj = {
        description: descRef.current,
        maxguests: maxguestsRef.current,
        creatorId: props.post.users.user.userId
    }

    await enterLoading(0);

    await UserService.createParty(params).then(res => {
      router.back();
    }).catch(error => {
      console.log(error.response.data.message)
    })
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
            <Input className={myStyles.cspan} size='large' placeholder='ชื่อปาร์ตี้' onChange={onDescChange}></Input>
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
              {
                pattern: /^\d+$/,
                message: 'โปรดกรอกจำนวนเป็นตัวเลข',
            }
            ]}
          >
            <Input className={myStyles.cspan} size='large' placeholder='จำนวนคนที่ขาด' onChange={onMaxguestChange}></Input>
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

const mapStateToProps = (state: any) => ({ post: state })

export default connect(mapStateToProps)(CreateParty)