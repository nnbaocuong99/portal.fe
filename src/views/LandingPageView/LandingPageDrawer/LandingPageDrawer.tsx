import {
  Radar16,
  Store16,
  Phone16,
  ShoppingCatalog16,
  CarouselHorizontal16,
  Task16,
  SummaryKpi16,
  DeskAdjustable16,
  IncreaseLevel16,
  CategoryNewEach16,
  Settings16,
  Launch16,
} from "@carbon/icons-react";
import React from "react";
import "./LandingPageDrawer.scss";

export interface LandingPageDrawerProps {
  isShowDrawer?: boolean;
}
function LandingPageDrawer(props: LandingPageDrawerProps) {
  const { isShowDrawer } = props;
  return (
    <>
      {" "}
      <div
        className={`landing-drawer__wrapper p--sm ${isShowDrawer && "show"}`}
      >
        <div className="landing-drawer__container">
          {/** group các site thuộc nhóm bán hàng */}
          <div className="landing-drawer__site-grouping m-b--xxl">
            <div className="landing-drawer__site-grouping-title p-y--sm m-t--xxs">
              Bán hàng
            </div>

            <div className="landing-drawer__list-site">
              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <Store16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">
                  Retail Execution
                </div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <Radar16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">
                  Sale vector
                </div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <Phone16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">Services</div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <ShoppingCatalog16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">
                  Website CMS
                </div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <CarouselHorizontal16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">AMS</div>
              </div>
            </div>
          </div>

          {/** group các site thuộc nhóm vận hành nội bộ */}

          <div className="landing-drawer__site-grouping m-b--xxl">
            <div className="landing-drawer__site-grouping-title p-y--sm m-t--xxs">
              Vận hành nội bộ
            </div>

            <div className="landing-drawer__list-site">
              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <ShoppingCatalog16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">
                  eProcurement
                </div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <ShoppingCatalog16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">Order Hub</div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <Task16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">
                  Daily Loop
                </div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <SummaryKpi16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">KPI</div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <DeskAdjustable16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">Office</div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <IncreaseLevel16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">
                  BI Reporting
                </div>
              </div>
            </div>
          </div>

          {/** group các site thuộc nhóm cài đặt */}
          <div className="landing-drawer__site-grouping m-b--lg">
            <div className="landing-drawer__site-grouping-title p-y--sm m-t--xxs">
              Cài đặt
            </div>

            <div className="landing-drawer__list-site">
              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <CategoryNewEach16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">
                  Master Data
                </div>
              </div>

              <div className="landing-drawer__site-item p-y--xxs">
                <div className="landing-drawer__site-item-icon">
                  <Settings16 color={"#fff"} />
                </div>
                <div className="landing-drawer__site-item-title">
                  Global Admin
                </div>
              </div>
            </div>
          </div>

          <div className="landing-drawer__all-site p-t--sm">
            <div className="landing-drawer__all-site--label color-white m-r--xxxs m-l--sm">
              Tất cả
            </div>
            <div className="landing-drawer__all-site--icon">
              <Launch16 color={"#fff"} />
            </div>
          </div>
        </div>
      </div>
      {isShowDrawer && (
        <div
          className={`landing-page__overlay ${isShowDrawer && "show"}`}
        ></div>
      )}
    </>
  );
}

export default LandingPageDrawer;
