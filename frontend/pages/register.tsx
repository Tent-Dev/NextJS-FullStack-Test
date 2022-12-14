import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form, message } from "antd";
import myStyles from '../styles/MyComponent.module.css'
import { useState, useRef } from 'react'
import axios from 'axios';

const Register: NextPage = () => {
  const [loadings, setLoadings] = useState([]);
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');

  const onEmailChange = (e: { target: { value: string } }) =>{
    emailRef.current = e.target.value
  }

  const onPasswordChange = (e: { target: { value: string } }) =>{
    passwordRef.current = e.target.value
  }

  const clickRegister = async () =>{
    await enterLoading(0);

    await axios.post('http://localhost:3100/api/user/add', {
      firstName : 'Firstname',
      lastName : 'Lastname',
      email : emailRef.current,
      password : passwordRef.current
    }).then(response => {
        router.push('/')
    }).catch((err) =>{
      if(err.response.data.code == 1004){
        message.error('อีเมลนี้มีอยู่ในระบบแล้ว');
      }
    });
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
      <div className={styles.container}>
    {/* <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head> */}

    <main className={styles.main}>
    <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={() => clickRegister()}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div style={{'marginBottom': 24, 'fontSize': 20, 'fontWeight': 'bold'}}>
          สร้างบัญชีผู้ใช้
        </div>
        <div>
          <div>
            <Form.Item
              name="email"
              hasFeedback
              rules={[
                {
                  type: 'email',
                  message: 'รูปแบบอีเมลไม่ถูกต้อง',
                },
                {
                  required: true,
                  message: 'โปรดกรอกอีเมล',
                },
              ]}
            >
              <Input className={myStyles.cspan} size='large' placeholder='อีเมล' onChange={onEmailChange}></Input>
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="password"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'โปรดกรอกรหัสผ่าน',
                },
              ]}
            >
              <Input className={myStyles.cspan} size='large' type={'password'} placeholder='รหัสผ่าน' onChange={onPasswordChange}></Input>
            </Form.Item>
          </div>
          <div>
          <Form.Item
            name="confirmpassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'โปรดกรอกรหัสผ่านอีกครั้ง',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
    
                  return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
                },
              }),
            ]}
          >
            <Input className={myStyles.cspan} size='large' type={'password'} placeholder='ยืนยันรหัสผ่าน'></Input>
          </Form.Item>
          </div>
          <div>
          <Form.Item
            name="accepttc"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('โปรดยอมรับเงื่อนไข')),
              },
            ]}
          >
          <Checkbox>ฉันยอมรับเงื่อนไขและข้อตกลงการใช้งาน</Checkbox>
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
              ยืนยัน
            </Button>
          </div>
        </div>
      </Form>
    </main>
  </div>
  )
}

export default Register