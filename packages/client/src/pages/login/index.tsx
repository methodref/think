import { Button, Form, Layout, Space, Typography } from '@douyinfe/semi-ui';
import { Author } from 'components/author';
import { LogoImage, LogoText } from 'components/logo';
import { Seo } from 'components/seo';
import { useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import Link from 'next/link';
import React, { useCallback } from 'react';

import styles from './index.module.scss';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Page = () => {
  const { login } = useUser();
  const [loading, toggleLoading] = useToggle(false);

  const toLogin = useCallback(
    (data) => {
      toggleLoading(true);
      login(data)
        .then(() => {
          toggleLoading(false);
        })
        .catch(() => {
          toggleLoading(false);
        });
    },
    [login, toggleLoading]
  );

  return (
    <Layout className={styles.wrap}>
      <Seo title="登录" />
      <Content className={styles.content}>
        <Title heading={4} style={{ marginBottom: 16, textAlign: 'center' }}>
          <Space>
            <LogoImage></LogoImage>
            <LogoText></LogoText>
          </Space>
        </Title>
        <Form className={styles.form} initValues={{ name: '', password: '' }} onSubmit={toLogin}>
          <Title type="tertiary" heading={5} style={{ marginBottom: 16, textAlign: 'center' }}>
            账户登录
          </Title>
          <Form.Input
            noLabel
            field="name"
            label="账户"
            style={{ width: '100%' }}
            placeholder="输入账户名称"
            rules={[{ required: true, message: '请输入账户' }]}
          ></Form.Input>
          <Form.Input
            noLabel
            mode="password"
            field="password"
            label="密码"
            style={{ width: '100%' }}
            placeholder="输入用户密码"
            rules={[{ required: true, message: '请输入密码' }]}
          ></Form.Input>
          <Button htmlType="submit" type="primary" theme="solid" block loading={loading} style={{ margin: '16px 0' }}>
            登录
          </Button>
          <footer>
            <Text link style={{ textAlign: 'center' }}>
              <Link href="/register">
                <a>注册用户以登录</a>
              </Link>
            </Text>
          </footer>
        </Form>
      </Content>
      <Footer>
        <Author />
      </Footer>
    </Layout>
  );
};

export default Page;
