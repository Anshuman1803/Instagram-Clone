import settingStyle from "./setting.module.css"
import UserDeleteComponent from './DeleteAccout';
function Privacy() {
  return (
    <section className={`${settingStyle.__Setting__PrivacyContainer}`}>

      <div className={`${settingStyle.__PrivacyContainer__DeleteAccoutBox}`}>
        <UserDeleteComponent />
      </div>

    </section>
  )
}

export default Privacy
