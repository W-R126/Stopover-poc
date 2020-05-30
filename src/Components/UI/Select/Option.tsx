interface OptionProps<T> {
  value: T;
  children: any;
}

export default function Option<T>(props: OptionProps<T>): JSX.Element {
  return props.children;
}
