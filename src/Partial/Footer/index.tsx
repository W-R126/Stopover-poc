import React from 'react';

import './Footer.css';
import ContentService from '../../Services/ContentService';
import Link from '../../Components/UI/Link';

interface Image {
  url?: string;
  alt?: string;
}

interface LinkItem {
  title?: string;
  url?: string;
  image?: Image;
  external?: boolean;
}

interface LinkGroup {
  title?: string;
  links?: LinkItem[];
}

export interface FooterProps {
  contentService: ContentService;
}

interface FooterState {
  content: {
    linkGroups?: LinkGroup[];
    socialMediaLinks?: LinkItem[];
    legalLinks?: LinkItem[];
    copyright?: string;
    image?: Image;
    common?: {
      opensInNewWindow?: string;
    };
  };
}

export default class Footer extends React.Component<FooterProps, FooterState> {
  constructor(props: FooterProps) {
    super(props);

    this.state = {
      content: {},
    };
  }

  async componentDidMount(): Promise<void> {
    const { contentService } = this.props;

    const footerReq = contentService.get('footer');
    const commonReq = contentService.get('common');

    const content = await footerReq;
    Object.assign(content, { common: await commonReq });

    this.setState({ content });
  }

  render(): JSX.Element {
    const { content } = this.state;

    return (
      <footer>
        <div className="content-wrapper">
          <div className="link-groups">
            {content?.linkGroups?.map((linkGroup, linkGroupIdx) => (
              <ul key={`link-group-${linkGroupIdx}`} className="link-group">
                <li className="link-group-header">{linkGroup.title}</li>
                {linkGroup.links?.map((link, linkIdx) => (
                  <li key={`link-group-item-${linkIdx}`} className="link-group-item">
                    <Link content={content.common} {...link} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <ul className="social-media-links">
            {content?.socialMediaLinks?.map((socialMediaLink, idx) => (
              <li key={`social-media-link-${idx}`} className="social-media-link">
                <Link content={content.common} {...socialMediaLink} />
              </li>
            ))}
          </ul>
          <div className="legal">
            <ul className="legal-links">
              {content?.legalLinks?.map((legalLink, idx) => (
                <li key={`legal-link-${idx}`} className="legal-link">
                  <Link content={content.common} {...legalLink} />
                </li>
              ))}
            </ul>
            <div className="abu-dhabi-to-the-world">
              <img src={content.image?.url} alt={content.image?.alt} />
              {content.copyright}
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
