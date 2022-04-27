import { useCallback, useEffect, useRef } from 'react';
import { Typography, Spin } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Resizeable } from 'components/resizeable';
import { useToggle } from 'hooks/use-toggle';
import { uploadFile } from 'services/file';
import { extractFileExtension, extractFilename, getImageWidthHeight } from '../../utils/file';
import { getEditorContainerDOMSize } from '../../utils/editor';
import styles from './index.module.scss';

const { Text } = Typography;

export const ImageWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { hasTrigger, error, src, alt, title, width, height, textAlign } = node.attrs;
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const $upload = useRef<HTMLInputElement>();
  const [loading, toggleLoading] = useToggle(false);

  const onResize = useCallback((size) => {
    updateAttributes({ height: size.height, width: size.width });
  }, []);

  const selectFile = useCallback(() => {
    if (!isEditable || error || src) return;
    isEditable && $upload.current.click();
  }, [isEditable, error, src]);

  const handleFile = useCallback(async (e) => {
    const file = e.target.files && e.target.files[0];

    const fileInfo = {
      fileName: extractFilename(file.name),
      fileSize: file.size,
      fileType: file.type,
      fileExt: extractFileExtension(file.name),
    };

    toggleLoading(true);

    try {
      const src = await uploadFile(file);
      const size = await getImageWidthHeight(file);
      updateAttributes({ ...fileInfo, ...size, src });
      toggleLoading(false);
    } catch (error) {
      updateAttributes({ error: '图片上传失败：' + (error && error.message) || '未知错误' });
      toggleLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!src && !hasTrigger) {
      selectFile();
      updateAttributes({ hasTrigger: true });
    }
  }, [src, hasTrigger]);

  return (
    <NodeViewWrapper as="div" style={{ textAlign, fontSize: 0, maxWidth: '100%' }}>
      <Resizeable
        className={'render-wrapper'}
        width={width || maxWidth}
        height={height}
        maxWidth={maxWidth}
        isEditable={isEditable}
        onChangeEnd={onResize}
      >
        {error ? (
          <div className={styles.wrap}>
            <Text>{error}</Text>
          </div>
        ) : !src ? (
          <div className={styles.wrap} onClick={selectFile}>
            <Spin spinning={loading}>
              <Text style={{ cursor: 'pointer' }}>{loading ? '正在上传中' : '请选择图片'}</Text>
              <input ref={$upload} accept="image/*" type="file" hidden onChange={handleFile} />
            </Spin>
          </div>
        ) : (
          <LazyLoadImage src={src} alt={alt} width={width} height={height} />
        )}
      </Resizeable>
    </NodeViewWrapper>
  );
};
