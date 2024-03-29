import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Input, Checkbox, Form, message } from "antd";
import myStyles from '../styles/MyComponent.module.css'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useDispatch, connect } from "react-redux";
import _ from 'lodash'
import AuthService from "../services/auth.service";
import styled from 'styled-components';

// import {wrapper, State} from '../reducer/store';

const Main = styled.main`
  min-height: 100vh;
  padding: 4rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Home: NextPage = (props: any) => {
  const [loadings, setLoadings] = useState([]);
  const [returnRender, setReturnRender] = useState(false);
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');

  const onEmailChange = (e: { target: { value: string } }) =>{
    emailRef.current = e.target.value
  }

  const onPasswordChange = (e: { target: { value: string } }) =>{
    passwordRef.current = e.target.value
  }

  useEffect(() =>{
    if(_.has(props, 'post') && _.has(props.post, 'users') && _.has(props.post.users, 'user')){
      router.push('/home');
    }else{
      setReturnRender(true);
    }
  },[])
  
  const clickLogin = async () =>{
    await enterLoading(0);

    AuthService.userLogin(emailRef.current, passwordRef.current).then((res) =>{
      // closeLoading(0);
      console.log('asd==> ', res)
      if(res.token){
        router.push('/home');
      }else{
        closeLoading(0);
        message.error(res.message);
      }
    }).catch(err => {
      closeLoading(0);
      message.error(err.message);
      console.log('xxxxxx==> ', err)
    });
  }

  const enterLoading = async (index: number) => {

    setLoadings((prevLoadings) => {
      const newLoadings: any = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  };

  const closeLoading = async (index: number) => {

      setLoadings((prevLoadings) => {
        const newLoadings: any = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
  };

  return (
    returnRender ?
    <div className={styles.container}>
      <Main>
        <div>
          <Image src="/logo.png" width="128px" height="64px" />
        </div>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={() => clickLogin()}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
        <div style={{'marginTop': 24}}>
        
          <div>
          <Form.Item
            name="username"
            rules={[
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
            rules={[
              {
                required: true,
                message: 'โปรดกรอกรหัสผ่าน',
              },
            ]}
          >
            <Input.Password className={myStyles.cspan} size='large' type={'password'} placeholder='รหัสผ่าน' onChange={onPasswordChange}></Input.Password>
          </Form.Item>
          </div>
        </div>
        <div>
          <div>
            <Button
              htmlType="submit"
              className={`${myStyles.cspan} ${myStyles.cbutton}`}
              type="primary"
              onClick={() => null}
              loading={loadings[0]}
            >
              เข้าสู่ระบบ
            </Button>
          </div>
          <div>
            <Link href={'/register'}>
              <Button className={`${myStyles.cbutton}`} type="primary">สร้างบัญชีผู้ใช้</Button>
            </Link>
          </div>
        </div>
        </Form>
      </Main>
    </div> : <></>
  )
}

const mapStateToProps = (state: any) => ({ post: state })

export default connect(mapStateToProps)(Home)
