import { useEffect } from 'react';
import { usePortfolioSilentModel } from '../Hooks/usePortfolioModel';
import buttonStyles from './button.module.css';

import Icon from '../portfolioIcon/Icon';

// #region type defi
type LinkButtonType = {
  Type: 'link';
};

type GeneralButtonType = {
  OnButtonClick: () => void;
  Disabled?: boolean;
  Color?: 'primary' | 'secondary' | 'general';
} & (LinkButtonType);

type LinkSpecificButtonType = {
  Disabled: boolean;
  OnButtonClick: () => void;
};

type CommonButtonReturnTypes = {
  'link': LinkSpecificButtonType;
};
// #endregion

// #region outer fns & cls
class ButtonDataHandler {
  private type: GeneralButtonType['Type'] = 'link';
  private disabled: boolean = false;
  private color: 'primary' | 'secondary' | 'general' = 'primary';
  private onButtonClick: () => void = () => alert('Button handler was never created');

  constructor (buttonProps: GeneralButtonType | null, generalButtonOnClickHandler: () => void) {
    if(buttonProps) {
      this.type = buttonProps.Type;
      this.onButtonClick = generalButtonOnClickHandler;

      if(buttonProps.Disabled) this.disabled = buttonProps.Disabled;
      if(buttonProps.Color) this.color = buttonProps.Color;
    }
  }

  prepareButtonProps<T extends GeneralButtonType['Type']>(type: T): CommonButtonReturnTypes[T] {
    switch(type) {
      case 'link':
        return {
          Disabled: this.disabled,
          OnButtonClick: this.onButtonClick,
        };
    }
  }
}
// #endregion

// #region other com
function LinkButton(props: { attr: ButtonDataHandler }) {
  const linkTypeButtonProps = props.attr.prepareButtonProps('link');

  const onClickHandler = () => linkTypeButtonProps.OnButtonClick();
  if(linkTypeButtonProps.Disabled) {
    return <div onClick={onClickHandler} title='This button is in disable state'>
      <Icon icon='FaUpRightFromSquare' />
    </div>;
  }
  return <div onClick={onClickHandler} className={buttonStyles.cursor}>
    <Icon icon='FaUpRightFromSquare' />
  </div>;
}
// #endregion

// #region Export com
export default function Button(props: GeneralButtonType) {
  const buttonAttributes = usePortfolioSilentModel<GeneralButtonType>({
    model: {
      Disabled: false,
      Color: 'primary',
      Type: 'link',
      OnButtonClick: () => alert('Button handlers were not created'),
    }
  });

  const onClickHandler = () => {
    if(!buttonAttributes.binders.getValue('Disabled')) {
      const fnClickhandler = buttonAttributes.binders.getValue('OnButtonClick');
      fnClickhandler();
    }
  };

  // this use effect will setup the default values
  // to the model
  useEffect(() => {
    buttonAttributes.binders.setsToModel({
      Type: props.Type,
      OnButtonClick: props.OnButtonClick,
    });
    if(props.Color)
      buttonAttributes.binders.setToModel('Color', props.Color);

    if(props.Type)
      buttonAttributes.binders.setToModel('Type', props.Type);

    if(props.Disabled)
      buttonAttributes.binders.setToModel('Disabled', props.Disabled);
  }, [buttonAttributes.binders, props]);

  const buttonHandler = new ButtonDataHandler(buttonAttributes.silentModel.current, onClickHandler);
  switch(props.Type) {
    case 'link':
      return <LinkButton attr={buttonHandler} />;
  }
}
// #endregion