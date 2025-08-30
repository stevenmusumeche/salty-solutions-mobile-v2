import React, { useCallback } from "react";
import PagerHeader from "../PagerHeader";
import { CombinedForecastV2DetailFragment } from "../../graphql/generated";
import { formatRelativeDate } from "../../utils/date-helpers";

interface ForecastHeaderProps {
  currentIndex: number;
  data: CombinedForecastV2DetailFragment[];
  user: {
    isLoggedIn: boolean;
    entitledToPremium: boolean;
  };
}

const ForecastHeader: React.FC<ForecastHeaderProps> = ({
  currentIndex,
  data,
  user,
}) => {
  const getTitle = useCallback((index: number) => {
    const currentData = data[index];
    
    if (currentData) {
      return formatRelativeDate(currentData.date);
    } else if (index >= data.length && !user.entitledToPremium) {
      // User is on teaser page
      return "Upgrade for More";
    }
    
    return "";
  }, [data, user.entitledToPremium]);

  return (
    <PagerHeader
      currentIndex={currentIndex}
      totalPages={data.length + (user.entitledToPremium ? 0 : 1)}
      getTitle={getTitle}
    />
  );
};

export default ForecastHeader;
