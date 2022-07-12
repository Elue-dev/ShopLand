import { useRef } from "react";
import Card from "../../components/card/Card";
import styles from "./contact.module.scss";
import { FaPhoneAlt, FaEnvelope, FaTwitter, FaLinkedin } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    console.log(form.current);

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAIJS_SERVICE_ID,
        "template_fxbkfjk",
        form.current,
        "LI-G3ioYQBUa9IpIn"
      )
      .then(
        (result) => {
          toast.success("Message sent successfully");
        },
        (error) => {
          toast.error(error.text);
        }
      );
    e.target.reset();
  };

  return (
    <section>
      <div className={`container ${styles.contact}`}>
        <h2>Contact Us</h2>
        <div className={styles.section}>
          <form ref={form} onSubmit={sendEmail}>
            <Card cardClass={styles.card}>
              <label>Name</label>
              <input
                type="text"
                name="user_name"
                placeholder="Full Name"
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="user_email"
                placeholder="Your active email"
                required
              />
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
              />
              <label>Message</label>
              <textarea name="message" cols="30" rows="10"></textarea>
              <button className="--btn --btn-primary --btn-block">Send Message</button>
            </Card>
          </form>

          <div className={styles.details}>
            <Card cardClass={styles.card2}>
              <h3>Our Contact Information</h3>
              <p>Fill the form or contact us via other channels listed below</p>
              <div className={styles.icons}>
                <span>
                  <FaPhoneAlt />
                  <p>+234 810 733 9039</p>
                </span>
                <span>
                  <FaEnvelope />
                  <p>support@shopland.com</p>
                </span>
                <span>
                  <GoLocation />
                  <p>Lagos, Nigeria</p>
                </span>
                <span>
                  <FaTwitter />
                  <a
                    href="https://www.linkedin.com/in/wisdom-elue-8822a5188"
                    style={{ color: "#ffff", fontSize: "1.5rem" }}
                  >
                    eluewisdom_
                  </a>
                </span>
                <span>
                  <FaLinkedin />
                  <a
                    href="https://www.twitter.com/eluewisdom_"
                    style={{ color: "#ffff", fontSize: "1.5rem" }}
                  >
                    Wisdom Elue
                  </a>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
