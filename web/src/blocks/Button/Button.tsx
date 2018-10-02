import * as React from 'react';
import { Block, Elem } from 'bem-react-core';
import './Button.css';

interface IButtonProps {
  children: string;
}

interface IModsProps extends IButtonProps {
  color: 'blue' | 'orange' | 'red' | 'green';
}

// Creating the Text element
class Text extends Elem {
  block = 'btn';
  elem = 'text';

  tag() {
    return 'span';
  }
}

// Creating the Button block
export class Button<T extends IModsProps> extends Block<T> {
  block = 'btn';

  tag() {
    return 'button';
  }

  mods() {
    return {
      color: this.props.color,
    };
  }

  attrs() {
    return {
      type: 'button'
    };
  }

  content() {
    return (
      <Text>{this.props.children}</Text>
    );
  }
}
