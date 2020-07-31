import React, { useState, useEffect } from 'react';

import css from './InfoModal.module.css';
import { PageProps } from './Page';

interface InfoModalProps {
  className?: string;
  children?: React.ReactNode;
  title: string;
  images?: {
    url: string;
    alt?: string;
  }[];
  onClose: () => void;
}

export default function InfoModal({
  children,
  className,
  title,
  images = [],
  onClose,
}: InfoModalProps): JSX.Element {
  const pages = React.Children.toArray(children) as { props: PageProps }[];
  const [selectedPage, setSelectedPage] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return (): void => {
      document.body.style.overflow = '';
    };
  });

  const [imageIdx, setImageIdx] = useState(0);

  return (
    <div className={css.InfoModalWrapper} onClick={onClose} role="button">
      <div
        className={[css.InfoModal, className].join(' ')}
        onClick={(e): void => {
          e.stopPropagation();
        }}
        role="button"
      >
        <div className={css.Header}>
          <span>{title}</span>

          <button type="button" onClick={onClose} className={css.Close}>
            <span />
          </button>
        </div>

        {images.length > 0 && (
          <div className={css.Images}>
            {images.length > 1 && imageIdx !== 0 && (
              <button
                type="button"
                className={[css.ImageButton, css.PrevImage].join(' ')}
                onClick={(): void => setImageIdx(imageIdx - 1)}
              >
                <span />
              </button>
            )}

            <img src={images[imageIdx].url} alt={images[imageIdx].alt ?? 'Image'} />

            {images.length > 1 && imageIdx !== images.length - 1 && (
              <button
                type="button"
                className={[css.ImageButton, css.NextImage].join(' ')}
                onClick={(): void => setImageIdx(imageIdx + 1)}
              >
                <span />
              </button>
            )}
          </div>
        )}

        <div className={css.Tabs}>
          {pages.map((page, idx) => (
            <button
              key={`tab-${idx}`}
              type="button"
              className={[css.TabButton, idx === selectedPage ? css.Selected : undefined].join(' ')}
              onClick={(): void => setSelectedPage(idx)}
            >
              {page.props.title}
            </button>
          ))}
        </div>

        <div className={css.Content}>
          {pages[selectedPage]}
        </div>
      </div>
    </div>
  );
}
