import * as React from 'react';
import { Text, TextProps, TouchableHighlightProps, ViewProps } from "react-native";
import Svg, { Path } from 'react-native-svg';
import {primaryDark} from '../constants/Colors';


export default function AppIcons({ size, name, color = primaryDark}: {size:number; name: string; color: string }) {
  switch(name){
    case `home`: 
      return (
        <Svg width={size} height={size} viewBox="0 0 24 25" fill="none">
          <Path d="M22.8823 11.2076L22.8806 11.2058L13.4974 1.41608C13.0975 0.998596 12.5657 0.768799 12.0001 0.768799C11.4345 0.768799 10.9028 0.998596 10.5026 1.41608L1.12443 11.2009C1.12127 11.2042 1.11794 11.2076 1.11495 11.2109C0.293643 12.0728 0.295047 13.4712 1.11899 14.3309C1.49542 14.7238 1.99242 14.9512 2.52399 14.9752C2.54575 14.9774 2.56752 14.9785 2.58945 14.9785H2.96325V22.183C2.96325 23.6088 4.07518 24.7688 5.44175 24.7688H9.11273C9.48495 24.7688 9.78663 24.4539 9.78663 24.0657V18.4172C9.78663 17.7667 10.294 17.2375 10.9175 17.2375H13.0828C13.7063 17.2375 14.2135 17.7667 14.2135 18.4172V24.0657C14.2135 24.4539 14.5151 24.7688 14.8874 24.7688H18.5583C19.9251 24.7688 21.0368 23.6088 21.0368 22.183V14.9785H21.3836C21.9491 14.9785 22.4808 14.7487 22.8811 14.3311C23.7059 13.4701 23.7063 12.0692 22.8823 11.2076ZM21.928 13.3368C21.7825 13.4886 21.5891 13.5723 21.3836 13.5723H20.3629C19.9907 13.5723 19.689 13.887 19.689 14.2754V22.183C19.689 22.8334 19.1819 23.3625 18.5583 23.3625H15.5613V18.4172C15.5613 16.9914 14.4495 15.8312 13.0828 15.8312H10.9175C9.55077 15.8312 8.43884 16.9914 8.43884 18.4172V23.3625H5.44175C4.8184 23.3625 4.31105 22.8334 4.31105 22.183V14.2754C4.31105 13.887 4.00937 13.5723 3.63715 13.5723H2.63403C2.6235 13.5715 2.61314 13.571 2.60244 13.5708C2.40167 13.5671 2.21337 13.484 2.07227 13.3366C1.77218 13.0235 1.77218 12.5139 2.07227 12.2006L11.4559 2.41034C11.6012 2.25854 11.7945 2.17505 12.0001 2.17505C12.2056 2.17505 12.3989 2.25854 12.5443 2.41034L21.925 12.1977C21.9264 12.1992 21.928 12.2006 21.9294 12.2021C22.2279 12.5157 22.2274 13.0242 21.928 13.3368Z" fill={color}/>
        </Svg>
        );
    case `puzzle`:
      return (
      <Svg width={size} height={size} viewBox="0 0 19 25"  fill="none">
        <Path d="M16.6719 11.8477C17.0428 11.8477 17.4074 11.9451 17.726 12.1294C18.1945 12.4004 18.7812 12.0611 18.7812 11.5208V5.51953C18.7812 5.13122 18.4664 4.81641 18.0781 4.81641H13.0801C13.1302 4.57097 13.1562 4.31855 13.1562 4.06641C13.1562 2.12789 11.5791 0.550781 9.64062 0.550781C7.70211 0.550781 6.125 2.12789 6.125 4.06641C6.125 4.31855 6.15102 4.57097 6.20113 4.81641H1.20312C0.814813 4.81641 0.5 5.13122 0.5 5.51953V11.5208C0.5 12.062 1.08744 12.3998 1.5552 12.1294C1.87386 11.9451 2.23841 11.8477 2.60938 11.8477C3.77248 11.8477 4.71875 12.7939 4.71875 13.957C4.71875 15.1201 3.77248 16.0664 2.60938 16.0664C2.23841 16.0664 1.87386 15.969 1.5552 15.7846C1.08678 15.5138 0.5 15.8528 0.5 16.3933V23.8477C0.5 24.236 0.814813 24.5508 1.20312 24.5508H7.20439C7.74547 24.5508 8.08367 23.9633 7.81297 23.4956C7.62866 23.1769 7.53125 22.8124 7.53125 22.4414C7.53125 21.2783 8.47752 20.332 9.64062 20.332C10.8037 20.332 11.75 21.2783 11.75 22.4414C11.75 22.8124 11.6526 23.1769 11.4682 23.4956C11.1972 23.964 11.5365 24.5508 12.0768 24.5508H18.0781C18.4664 24.5508 18.7812 24.236 18.7812 23.8477V16.3933C18.7812 15.8522 18.1939 15.5141 17.726 15.7846C17.4074 15.969 17.0428 16.0664 16.6719 16.0664C15.5088 16.0664 14.5625 15.1201 14.5625 13.957C14.5625 12.7939 15.5088 11.8477 16.6719 11.8477ZM16.6719 17.4727C16.909 17.4727 17.1446 17.4487 17.375 17.4018V23.1445H13.0853C13.1323 22.914 13.1562 22.6785 13.1562 22.4414C13.1562 20.5029 11.5791 18.9258 9.64062 18.9258C7.70211 18.9258 6.125 20.5029 6.125 22.4414C6.125 22.6785 6.14895 22.914 6.19592 23.1445H1.90625V17.4018C2.13669 17.4487 2.37228 17.4727 2.60938 17.4727C4.54789 17.4727 6.125 15.8955 6.125 13.957C6.125 12.0185 4.54789 10.4414 2.60938 10.4414C2.37228 10.4414 2.13669 10.4654 1.90625 10.5123V6.22266H7.20439C7.74547 6.22266 8.08367 5.63522 7.81297 5.16745C7.63395 4.85789 7.53125 4.45659 7.53125 4.06641C7.53125 2.9033 8.47752 1.95703 9.64062 1.95703C10.8037 1.95703 11.75 2.9033 11.75 4.06641C11.75 4.45659 11.6473 4.85789 11.4682 5.16745C11.1972 5.63583 11.5365 6.22266 12.0768 6.22266H17.375V10.5123C17.1446 10.4654 16.909 10.4414 16.6719 10.4414C14.7334 10.4414 13.1562 12.0185 13.1562 13.957C13.1562 15.8955 14.7334 17.4727 16.6719 17.4727Z" fill={color}/>
      </Svg>
      );
    case `order`:
      return (
        <Svg width={size} height={size} viewBox="0 0 22 25"  fill="none">
          <Path d="M17.0917 8.7541H15.7709V7.0212C16.3702 6.37665 16.688 5.5185 16.6474 4.63135C16.6103 3.82383 16.2748 3.05951 15.7024 2.47917C15.1299 1.89859 14.3702 1.55262 13.5633 1.50486C12.9144 1.46604 12.2759 1.61745 11.7176 1.94151C11.6342 1.98992 11.5222 1.96792 11.457 1.89041C10.7399 1.03659 9.68956 0.546875 8.57542 0.546875C7.46127 0.546875 6.41091 1.03659 5.69364 1.89046C5.62854 1.96788 5.51652 1.98988 5.43332 1.9416C4.87526 1.61749 4.23734 1.46665 3.5878 1.50486C2.78085 1.55253 2.02103 1.8985 1.4485 2.47898C0.876147 3.05927 0.540521 3.8236 0.50348 4.63117C0.462773 5.51841 0.78063 6.37661 1.37991 7.0212V22.4316C1.37991 23.598 2.32883 24.5469 3.4952 24.5469H13.6556C14.822 24.5469 15.7709 23.598 15.7709 22.4316V21.7584H17.0917C19.5541 21.7584 21.5574 19.7551 21.5574 17.2928V13.2197C21.5574 10.7574 19.5541 8.7541 17.0917 8.7541ZM15.7709 12.9847H16.6217C17.0105 12.9847 17.3268 13.301 17.3268 13.6898V16.8226C17.3268 17.2114 17.0105 17.5277 16.6217 17.5277H15.7709V12.9847ZM1.91221 4.6958C1.95551 3.75158 2.7281 2.96831 3.67105 2.91256C4.04283 2.89052 4.40741 2.97645 4.72517 3.16104C5.40399 3.55524 6.26543 3.40232 6.77347 2.79745C7.2221 2.26341 7.87887 1.95707 8.57542 1.95707C9.27196 1.95707 9.92873 2.26336 10.3773 2.7974C10.8854 3.40232 11.7468 3.55533 12.4257 3.16099C12.7436 2.97645 13.1082 2.89047 13.48 2.91256C14.4229 2.96836 15.1954 3.75168 15.2387 4.69589C15.26 5.15999 15.1101 5.61031 14.8223 5.96558H7.02068V10.3966C7.02068 10.7854 6.70437 11.1017 6.31558 11.1017C5.92679 11.1017 5.61049 10.7854 5.61049 10.3966V5.96558H2.3286C2.04073 5.61031 1.89087 5.15994 1.91221 4.6958ZM14.3607 22.4315C14.3607 22.8203 14.0444 23.1366 13.6556 23.1366H3.4952C3.10641 23.1366 2.79011 22.8203 2.79011 22.4315V7.37573H4.2003V10.3965C4.2003 11.5629 5.14921 12.5118 6.31558 12.5118C7.48195 12.5118 8.43087 11.5629 8.43087 10.3965V7.37573H14.3607V22.4315ZM20.1472 17.2927C20.1472 18.9775 18.7765 20.3481 17.0917 20.3481H15.7709V18.9379H16.6217C17.7881 18.9379 18.737 17.989 18.737 16.8226V13.6898C18.737 12.5234 17.7881 11.5745 16.6217 11.5745H15.7709V10.1643H17.0917C18.7765 10.1643 20.1472 11.5349 20.1472 13.2197V17.2927Z" fill={color}/>
        </Svg>
      );
    case `profile`:
      return (
        <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
          <Path d="M20.9853 3.76471C18.7188 1.49823 15.7053 0.25 12.5 0.25C9.29456 0.25 6.28119 1.49823 4.01471 3.76471C1.74823 6.03119 0.5 9.04456 0.5 12.25C0.5 15.4553 1.74823 18.4688 4.01471 20.7353C6.28119 23.0018 9.29456 24.25 12.5 24.25C15.7053 24.25 18.7188 23.0018 20.9853 20.7353C23.2518 18.4688 24.5 15.4553 24.5 12.25C24.5 9.04456 23.2518 6.03119 20.9853 3.76471ZM6.51593 20.9869C7.01782 18.0971 9.52197 15.9656 12.5 15.9656C15.4782 15.9656 17.9822 18.0971 18.4841 20.9869C16.7803 22.1575 14.7189 22.8438 12.5 22.8438C10.2811 22.8438 8.21973 22.1575 6.51593 20.9869ZM8.68445 10.7438C8.68445 8.63971 10.3961 6.92822 12.5 6.92822C14.6039 6.92822 16.3156 8.63989 16.3156 10.7438C16.3156 12.8477 14.6039 14.5593 12.5 14.5593C10.3961 14.5593 8.68445 12.8477 8.68445 10.7438ZM19.7021 20.0115C19.3236 18.6662 18.572 17.4456 17.5184 16.4922C16.872 15.9072 16.1363 15.4456 15.3453 15.1202C16.775 14.1876 17.722 12.5743 17.722 10.7438C17.722 7.86444 15.3793 5.52197 12.5 5.52197C9.62067 5.52197 7.2782 7.86444 7.2782 10.7438C7.2782 12.5743 8.22522 14.1876 9.65472 15.1202C8.86389 15.4456 8.12799 15.907 7.48163 16.492C6.42822 17.4454 5.67639 18.666 5.29791 20.0113C3.21326 18.0753 1.90625 15.3126 1.90625 12.25C1.90625 6.40857 6.65857 1.65625 12.5 1.65625C18.3414 1.65625 23.0938 6.40857 23.0938 12.25C23.0938 15.3128 21.7867 18.0755 19.7021 20.0115Z" fill={color}/>
        </Svg>
      );
      case `success`:
        return (
          <Svg  width={size} height={size} viewBox="0 0 35 35"  fill="none">
          <Path d="M26.2391 11.7468C25.7004 11.1787 24.8022 11.1537 24.2332 11.6938L15.1749 20.2844L10.8543 15.8484C10.3071 15.2869 9.40986 15.2746 8.84795 15.8219C8.28651 16.3687 8.27468 17.2668 8.82142 17.8283L14.1187 23.267C14.3963 23.5522 14.7653 23.696 15.1352 23.696C15.4861 23.696 15.8371 23.5664 16.1119 23.3067L26.1862 13.7527C26.7547 13.2135 26.7787 12.3153 26.2391 11.7468Z" fill={color}/>
          <Path d="M17.5 0C7.85039 0 0 7.85039 0 17.5C0 27.1496 7.85039 35 17.5 35C27.1496 35 35 27.1496 35 17.5C35 7.85039 27.1496 0 17.5 0ZM17.5 32.1622C9.41548 32.1622 2.8378 25.5851 2.8378 17.5C2.8378 9.41548 9.41541 2.8378 17.5 2.8378C25.585 2.8378 32.1622 9.41541 32.1622 17.5C32.1622 25.585 25.585 32.1622 17.5 32.1622Z" fill={color}/>
          </Svg>
        );
        case `error`:
          return (
            <svg width={size} height={size} viewBox="0 0 35 36"  fill="none">
              <Path d="M29.882 5.12533C23.0578 -1.70063 11.9506 -1.70063 5.12652 5.12533C1.82091 8.43314 0 12.8301 0 17.5064C0 22.1826 1.82091 26.5796 5.12652 29.8861C8.53926 33.2997 13.0218 35.0059 17.5042 35.0059C21.9866 35.0059 26.4692 33.2997 29.8819 29.8861C36.706 23.0601 36.706 11.9526 29.882 5.12533ZM27.9647 27.9683C22.1968 33.7378 12.8116 33.7378 7.04368 27.9683C4.25063 25.1745 2.71171 21.4584 2.71171 17.5064C2.71171 13.5543 4.25063 9.83818 7.04368 7.043C12.8116 1.27356 22.1968 1.27493 27.9647 7.043C33.7312 12.8124 33.7312 22.2003 27.9647 27.9683Z" fill={color}/>
              <Path d="M23.3467 21.2541L19.5082 17.42L23.3467 13.586C23.8754 13.0571 23.8754 12.1986 23.348 11.6682C22.8179 11.1366 21.9597 11.138 21.4295 11.6669L17.5884 15.5037L13.7472 11.6669C13.2171 11.138 12.3588 11.1366 11.8287 11.6682C11.2999 12.1985 11.2999 13.057 11.8301 13.586L15.6686 17.42L11.8301 21.2541C11.2999 21.783 11.2999 22.6415 11.8287 23.1718C12.0931 23.4376 12.4415 23.5692 12.7887 23.5692C13.1358 23.5692 13.4829 23.4362 13.7473 23.1731L17.5884 19.3363L21.4296 23.1731C21.694 23.4376 22.0411 23.5692 22.3882 23.5692C22.7353 23.5692 23.0838 23.4362 23.3482 23.1718C23.8768 22.6415 23.8768 21.783 23.3467 21.2541Z" fill={color}/>
            </svg>
          );
     default:   
      return (
          <Svg  width={size} height={size} viewBox="0 0 24 24"  fill="none">
            <Path d="M12 18.9141C12.6472 18.9141 13.1719 18.3894 13.1719 17.7422C13.1719 17.095 12.6472 16.5703 12 16.5703C11.3528 16.5703 10.8281 17.095 10.8281 17.7422C10.8281 18.3894 11.3528 18.9141 12 18.9141Z" fill={color}/>
            <Path d="M12 0C5.36794 0 0 5.36705 0 12C0 18.6321 5.36705 24 12 24C18.6321 24 24 18.633 24 12C24 5.36794 18.633 0 12 0ZM12 22.125C6.4042 22.125 1.875 17.5965 1.875 12C1.875 6.4042 6.40345 1.875 12 1.875C17.5958 1.875 22.125 6.40345 22.125 12C22.125 17.5958 17.5965 22.125 12 22.125Z" fill={color}/>
            <Path d="M12 6.02344C9.93225 6.02344 8.25 7.70569 8.25 9.77344C8.25 10.2912 8.66972 10.7109 9.1875 10.7109C9.70528 10.7109 10.125 10.2912 10.125 9.77344C10.125 8.73956 10.9661 7.89844 12 7.89844C13.0339 7.89844 13.875 8.73956 13.875 9.77344C13.875 10.8073 13.0339 11.6484 12 11.6484C11.4822 11.6484 11.0625 12.0682 11.0625 12.5859V14.9297C11.0625 15.4475 11.4822 15.8672 12 15.8672C12.5178 15.8672 12.9375 15.4475 12.9375 14.9297V13.4048C14.5531 12.9875 15.75 11.5176 15.75 9.77344C15.75 7.70569 14.0677 6.02344 12 6.02344Z" fill={color}/>
          </Svg>
        );
    
  }

}

