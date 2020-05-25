import React from 'react';

import './Logo.css';
import etihadLogo from './Images/Etihad.svg';
import arabicLogo from './Images/Arabic.svg';

import ContentService from '../../Services/ContentService';

export enum ChooseWellAlignEnum {
  RIGHT = 0,
  BOTTOM = 1,
}

interface LogoProps {
  contentService: ContentService;
  display: {
    arabic?: boolean;
    airways?: boolean;
    chooseWell?: boolean;
  };
  chooseWellAlign: ChooseWellAlignEnum;
  size: string | number;
}

interface LogoState {
  content: {
    alt?: string;
    chooseWell?: string;
    airways?: string;
  };
}

export default class Logo extends React.Component<LogoProps, LogoState> {
  static defaultProps: Pick<LogoProps, 'display' | 'chooseWellAlign' | 'size'> = {
    display: {
      arabic: true,
      airways: true,
      chooseWell: true,
    },
    chooseWellAlign: ChooseWellAlignEnum.RIGHT,
    size: '2rem',
  };

  constructor(props: LogoProps) {
    super(props);

    this.state = {
      content: {},
    };
  }

  async componentDidMount(): Promise<void> {
    const { contentService } = this.props;

    this.setState({
      content: await contentService.get('logo'),
    });
  }

  private get className(): string {
    const {
      display: {
        arabic: displayArabic = true,
        airways: displayAirways = true,
        chooseWell: displayChooseWell = true,
      },
      chooseWellAlign,
    } = this.props;

    const result = ['logo-component'];

    if (displayArabic) {
      result.push('arabic');
    }

    if (displayAirways) {
      result.push('airways');
    }

    if (displayChooseWell) {
      result.push('choose-well');
    }

    if (chooseWellAlign === ChooseWellAlignEnum.RIGHT) {
      result.push('align-right');
    } else {
      result.push('align-bottom');
    }

    return result.join(' ');
  }

  render(): JSX.Element {
    const { content } = this.state;
    const { size } = this.props;

    return (
      <div className={this.className} style={{ fontSize: size }}>
        <div className="logos-container">
          <div className="arabic-container">
            <img src={arabicLogo} alt={content?.alt} />
          </div>
          <img src={etihadLogo} alt={content?.alt} />
          <div className="airways-container">
            <span>{content.airways}</span>
          </div>
        </div>
        <div className="choose-well-container">
          <span>{content.chooseWell}</span>
        </div>
      </div>
    );
  }
}
