import { IconEdit } from '@douyinfe/semi-icons';
import { BackTop, Button, Layout, Nav, Skeleton, Space, Spin, Tooltip, Typography } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { DocumentCollaboration } from 'components/document/collaboration';
import { CommentEditor } from 'components/document/comments';
import { DocumentShare } from 'components/document/share';
import { DocumentStar } from 'components/document/star';
import { DocumentStyle } from 'components/document/style';
import { DocumentVersion } from 'components/document/version';
import { ImageViewer } from 'components/image-viewer';
import { Seo } from 'components/seo';
import { useDocumentDetail } from 'data/document';
import { useUser } from 'data/user';
import { triggerJoinUser } from 'event';
import { useDocumentStyle } from 'hooks/use-document-style';
import { useMount } from 'hooks/use-mount';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useWindowSize } from 'hooks/use-window-size';
import Router from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CollaborationEditor } from 'tiptap/editor';

import { Author } from './author';
import styles from './index.module.scss';

const { Header } = Layout;
const { Text } = Typography;
const getEditBtnStyle = (right = 16) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 30,
  width: 30,
  borderRadius: '100%',
  backgroundColor: '#0077fa',
  color: '#fff',
  right,
  bottom: 70,
  transform: 'translateY(-50px)',
});

interface IProps {
  documentId: string;
}

export const DocumentReader: React.FC<IProps> = ({ documentId }) => {
  const { isMobile } = IsOnMobile.useHook();
  const mounted = useMount();
  const { width: windowWidth } = useWindowSize();
  const { user } = useUser();
  const { data: documentAndAuth, loading: docAuthLoading, error: docAuthError } = useDocumentDetail(documentId);
  const { document, authority } = documentAndAuth || {};
  const [readable, editable] = useMemo(() => {
    if (!authority) return [false, false];
    return [authority.readable, authority.editable];
  }, [authority]);

  const renderAuthor = useCallback(
    (element) => {
      if (!document) return null;
      const target = element && element.querySelector('.ProseMirror .title');

      if (target) {
        return createPortal(<Author document={document} />, target);
      }

      return null;
    },
    [document]
  );

  const gotoEdit = useCallback(() => {
    Router.push(`/wiki/${document.wikiId}/document/${document.id}/edit`);
  }, [document]);

  const actions = useMemo(() => {
    return (
      <Space>
        {document && (
          <DocumentCollaboration
            disabled={!readable}
            key="collaboration"
            wikiId={document.wikiId}
            documentId={documentId}
          />
        )}
        <Tooltip key="edit" content="编辑" position="bottom">
          <Button disabled={!editable} icon={<IconEdit />} onMouseDown={gotoEdit} />
        </Tooltip>
        <DocumentShare disabled={!readable} key="share" documentId={documentId} />
        <DocumentVersion disabled={!readable} key="version" documentId={documentId} />
        <DocumentStar disabled={!readable} key="star" documentId={documentId} />
        <DocumentStyle />
      </Space>
    );
  }, [document, documentId, readable, editable, gotoEdit]);

  return (
    <div className={styles.wrap}>
      <Header className={styles.headerWrap}>
        <Nav
          style={{ overflow: 'auto', paddingLeft: 0, paddingRight: 0 }}
          mode="horizontal"
          header={
            <DataRender
              loading={docAuthLoading}
              error={docAuthError}
              loadingContent={<Skeleton active placeholder={<Skeleton.Title style={{ width: 80 }} />} loading={true} />}
              normalContent={() => (
                <Text
                  strong
                  ellipsis={{
                    showTooltip: { opts: { content: document.title, style: { wordBreak: 'break-all' } } },
                  }}
                  style={{ width: isMobile ? windowWidth - 100 : ~~(windowWidth / 3) }}
                >
                  {document.title}
                </Text>
              )}
            />
          }
          footer={isMobile ? <></> : actions}
        ></Nav>
      </Header>
      <Layout className={styles.contentWrap}>
        <DataRender
          loading={docAuthLoading}
          loadingContent={
            <div
              style={{
                minHeight: 240,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
              }}
            >
              <Spin />
            </div>
          }
          error={docAuthError}
          normalContent={() => (
            <>
              <Seo title={document.title} />
              {mounted && (
                <CollaborationEditor
                  editable={false}
                  user={user}
                  id={documentId}
                  type="document"
                  renderInEditorPortal={renderAuthor}
                  onAwarenessUpdate={triggerJoinUser}
                />
              )}
            </>
          )}
        />
      </Layout>
      {isMobile && <div className={styles.mobileToolbar}>{actions}</div>}
    </div>
  );
};
