import "../BenefitsSection.css";
import phone from "../assets/phone.jpg";
import {
  FaCloudSun,
  FaLeaf,
  FaWater,
  FaMoneyBillWave,
} from "react-icons/fa";

function BenefitsSection() {
  return (
    <section className="benefits-sec" id="benefits">
      {/* LEFT */}
      <div className="benefits-left fade-slide-left">

        <h2 className="benefits-title">
          How SmartFarmer helps you improve <span>your operations</span>
        </h2>

        <div className="benefit float">
          <FaCloudSun className="benefit-icon weather" />
          <div>
            <h3>Stay Informed</h3>
            <p>
              Real-time weather, soil moisture & crop alerts on a unified dashboard.
            </p>
          </div>
        </div>

        <div className="benefit float delay-1">
          <FaMoneyBillWave className="benefit-icon money" />
          <div>
            <h3>Save Time & Money</h3>
            <p>
              Avoid unnecessary pesticide sprays by monitoring wind & humidity.
            </p>
          </div>
        </div>

        <div className="benefit float delay-2">
          <FaLeaf className="benefit-icon leaf" />
          <div>
            <h3>Climate Protection</h3>
            <p>
              Prevent frost & heat damage using smart micro-climate alerts.
            </p>
          </div>
        </div>

        <div className="benefit float delay-3">
          <FaWater className="benefit-icon water" />
          <div>
            <h3>Smart Irrigation</h3>
            <p>
              Irrigate only when required using soil moisture intelligence.
            </p>
          </div>
        </div>

      </div>

      {/* RIGHT */}
      <div className="benefits-right fade-slide-right">
        <img src={phone} alt="SmartFarmer Dashboard" />
      </div>
    </section>
  );
}

export default BenefitsSection;
