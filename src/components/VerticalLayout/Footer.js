import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <div className="flex gap-10">
            <div >{new Date().getFullYear()} © Estarch.</div>
            <div >
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop <i className="mdi mdi-heart text-danger"></i> by Web Waiver
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
