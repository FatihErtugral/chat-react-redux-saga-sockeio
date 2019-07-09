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

  // TODO yüksek hızda mesaj geldiğinde scroll istenildiği gibi altta sabit kalması bozuluyor.
  useEffect((): any => {
    if (scrollBott) {
      let x = elementRef.current;
      if(x) {
        let y = x.scrollHeight;
        let z = x.clientHeight;
        x && x.scrollTo(0, (y - z));
      }

    }
  });

  const handleScroll = (e: Event):any => {
    e.preventDefault();

    if (e.target) {
      const { scrollTop, clientHeight, scrollHeight }:any = e.target;
      if (scrollTop + clientHeight + scrollHeight / 100 >= scrollHeight)
        setscrollBott(true);
      else setscrollBott(false);
    }
  };

  return (
    <div id="chat-text-body" className="chat-text-area">
      <div
        id = "chat-text"
        ref={elementRef}
        dangerouslySetInnerHTML={{__html:txt}}
      >
      </div>
    </div>
  );
}

export default ChatTextBody;
