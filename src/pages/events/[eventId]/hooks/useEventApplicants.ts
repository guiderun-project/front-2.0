import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/services';

import { eventDetailQueryKeys } from '../queryKeys';
import type { EventDetailTab } from '../types';

type UseEventApplicantsParams = {
  activeTab: EventDetailTab;
  canViewApplicantForm: boolean;
  canViewApplicants: boolean;
  eventId: number;
};

export const useEventApplicants = ({
  activeTab,
  canViewApplicantForm,
  canViewApplicants,
  eventId,
}: UseEventApplicantsParams) => {
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null,
  );
  const isValidEventId = Number.isInteger(eventId) && eventId > 0;
  const canFetchApplicants =
    isValidEventId && canViewApplicants && activeTab === 'applicants';
  const canFetchApplicantForm =
    isValidEventId && canViewApplicantForm && selectedApplicantId !== null;

  const applicantsQuery = useQuery({
    queryKey: eventDetailQueryKeys.applicants(eventId),
    queryFn: () => api.application.applicantsGet({ eventId }),
    enabled: canFetchApplicants,
  });

  const applicantFormQuery = useQuery({
    queryKey: eventDetailQueryKeys.applicantForm(
      eventId,
      selectedApplicantId ?? 'none',
    ),
    queryFn: () => {
      if (!selectedApplicantId) {
        throw new Error('Applicant is not selected.');
      }

      return api.application.applicantFormGet({
        eventId,
        userId: selectedApplicantId,
      });
    },
    enabled: canFetchApplicantForm,
  });

  const openApplicantForm = (applicantId: string) => {
    if (!canViewApplicantForm) {
      return;
    }

    setSelectedApplicantId(applicantId);
  };

  const closeApplicantForm = () => {
    setSelectedApplicantId(null);
  };

  return {
    applicantFormQuery,
    applicantsQuery,
    closeApplicantForm,
    openApplicantForm,
    selectedApplicantId,
  };
};
