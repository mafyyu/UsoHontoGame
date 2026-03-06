import { useLanguage } from "@/hooks/useLanguage"
import Link from "next/link";

type Props = {
   path: string,
}

export function Navigation({path}: Props){
  const { t } = useLanguage();
  let displayText = "";

  switch (path){
    case "/":
      displayText = `${t('navigation.home')}`
      break;
    case "/games":
      displayText = `${t('navigation.gameList')}`
      break;
  }

  return(
    <>
      <Link
        className="inline-flex items-center rounded-md bg-green-500 hover:bg-green-400 px-2 py-2 text-sm font-medium text-white shadow-sm hover:bg-green- focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2" 
        href={path}
        >
          {displayText}へ
      </Link>
    </>
  )
}