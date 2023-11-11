import React from 'react';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import post from '../api/post';
import './login.css'
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate()

  const login = async (data) => {
    await post.login(data)
      .then((res) => {
        localStorage.setItem('token', res.access_token)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        navigate('/')
      })
  }

  const onFinish = async (values) => {
    await login(values)
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='login-container'>
      <div className='form-container'>
        <h2 style={{ color: '#363636' }}>Log In to your account</h2>
        <Form
          name="basic"
          layout='vertical'
          size='large'
          labelCol={{
            span: 8,
          }}
          style={{
            width: 400,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input type='email' />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Login;