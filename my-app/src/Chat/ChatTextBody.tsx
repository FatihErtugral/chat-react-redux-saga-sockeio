import React, { useEffect, useRef, useState } from 'react';

interface IChatBodyState {
  text: string;
}

type IProps = IChatBodyState;

function ChatTextBody(props: IProps) {
  const { text } = props;
  const [scrollBott, setscrollBott] = useState<boolean>(true);
  const [txt, setTxt] = useState<string>('');
  const elementRef = useRef<HTMLTextAreaElement>(null);

  useEffect((): any => {
    setTxt(text);
  }, [text]);
  useEffect((): any => {
    if (scrollBott) {
      let x = elementRef.current;
      x && x.scrollTo(0, x.scrollHeight - x.clientHeight);
    }
  });

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight + scrollHeight / 400 >= scrollHeight)
      setscrollBott(true);
    else setscrollBott(false);
  };

  return (
    <div style={{position:'relative', height: 'calc(100% - 40px'}}>
      <textarea
        readOnly={true}
        onScroll={handleScroll}
        value={txt}
        ref={elementRef}
        style={{
          boxSizing:'border-box',
          position:'absolute',
          margin: '0',
          padding: '10px',
          scrollSnapType: 'both proximity',
          backgroundColor: '#1e1e1e',
          color: '#cccccc',
          resize: 'none',
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          overflowX: 'hidden',
          border: 'none',
          fontFamily: 'monaco'

        }}
      ></textarea>
    </div>
  );
}

export default ChatTextBody;
