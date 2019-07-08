import React, { useEffect, useRef, useState } from 'react';

interface IChatBodyState {
  text: string;
}

type IProps = IChatBodyState;

function ChatTextBody(props: IProps) {
  const { text } = props;
  const [scrollBott, setscrollBott] = useState<boolean>(true);
  const [txt, setTxt] = useState<string>('');
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    let textBody = elementRef.current;
    textBody
    && textBody.addEventListener('scroll',handleScroll);
    return () => {
      textBody
      && textBody.removeEventListener('scroll',handleScroll);
    }
  })

  useEffect((): any => {
    setTxt(text);
  }, [text]);

  useEffect((): any => {
    if (scrollBott) {
      let x = elementRef.current;
      x && x.scrollTo(0, x.scrollHeight - x.clientHeight);
    }
  });

  const handleScroll = (e: Event):any => {
    e.preventDefault();

    if (e.target) {
      const { scrollTop, clientHeight, scrollHeight }:any = e.target;
      if (scrollTop + clientHeight + scrollHeight / 400 >= scrollHeight)
        setscrollBott(true);
      else setscrollBott(false);
    }
  };

  return (
    <div className="chat-text-area">
      <div
        className = "chat-text"
        ref={elementRef}
        dangerouslySetInnerHTML={{__html:txt}}
      >
      </div>
    </div>
  );
}

export default ChatTextBody;
