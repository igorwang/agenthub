import { SourceCard } from "@/components/Conversation/source-card";
import { SOURCE_TYPE_ENUM, SourceDTO } from "@/types/chatTypes";
import { Icon } from "@iconify/react";

type SourceSectionProps = {
  title: string;
  items: SourceDTO[];
};

const sources = [
  {
    sourceType: SOURCE_TYPE_ENUM.file,
    fileId: "a81a0050-d09f-4faa-a000-c2e74c44bcab",
    fileName:
      "Frequently Asked Questions on the Implementation and Transition Arrangements of the Code on Unit Tru (1).pdf",
    url: "https://www.sfc.hk/en/Welcome-to-the-Fintech-Contact-Point/Virtual-assets/Virtual-asset-trading-platforms-operators/Regulatory-requirements/FAQs-on-conduct-related-matters/Cybersecurity/1-March-2024-Cybersecurity#3AE548D914154F8D94D5EBB5A7D75A7B",
    pages: [1, 7, 9],
    content:
      "|Col1|Question|Answer|\n|---|---|---|\n|General|||\n|1. The revised UT Code will become effective on 1 A 12-month transition period (“Transition Period”) from the Effective Date ending on January 2019 (“Effective Date”). Will there be 31 December 2019 will be provided for existing funds and existing management any transition period for existing funds? companies and trustees/custodians. With effect from the Effective Date, the revised UT Code and the enhanced KFS disclosures for derivative investments (see Question 4 below) will apply to new funds with new management companies and new trustees/custodians with immediate effect. For further details on the implementation and transition arrangements, please refer to the implementation schedule as set out in the revised UT Code.|||\n|2.|Will SFC’s prior approval and advance notice to investors be required for changes made to comply with the revised UT Code?|If changes are made by existing funds to comply with the revised UT Code and there are no material changes to the funds’ investment objectives, policies or strategies, prior approval from the SFC and advance notice to investors will generally not be required. However, management companies should provide necessary updates to the holders of the funds regarding the changes made to the funds as soon as reasonably practicable (whether by a specific notice or in the financial report of the funds) for holders’ appraisal of the funds and their investments. A summary of the changes (including the reason(s) and description of the change, implications to the funds and the resulting impact on investors) is expected to be provided to keep holders informed and enable them to appraise the position of the funds.|\n|Offering documents|||\n|3. If the funds’ offering documents are revised to Where changes to the offering documents of the existing funds are made to reflect comply with the enhanced disclosures the enhanced disclosures and contents requirements necessary for compliance with requirements under the revised UT Code, will the revised UT Code, SFC’s prior approval and advance notice to investors will these amendments be subject to the prior generally not be required (further see Question 8 below). The updated offering approval by the SFC? documents should be filed with the SFC in accordance with 11.1B of the revised UT|||\n\n\n-----\n\n",
  },
  {
    sourceType: SOURCE_TYPE_ENUM.file,
    fileId: "a81a0050-d09f-4faa-a000-c2e74c44bcab",
    fileName:
      "Frequently Asked Questions on the Implementation and Transition Arrangements of the Code on Unit Tru (1).pdf",
    url: "https://www.sfc.hk/en/Welcome-to-the-Fintech-Contact-Point/Virtual-assets/Virtual-asset-trading-platforms-operators/Regulatory-requirements/FAQs-on-conduct-related-matters/Cybersecurity/1-March-2024-Cybersecurity#3AE548D914154F8D94D5EBB5A7D75A7B",
    pages: [1, 7, 9],
    content:
      "|Col1|Question|Answer|\n|---|---|---|\n|General|||\n|1. The revised UT Code will become effective on 1 A 12-month transition period (“Transition Period”) from the Effective Date ending on January 2019 (“Effective Date”). Will there be 31 December 2019 will be provided for existing funds and existing management any transition period for existing funds? companies and trustees/custodians. With effect from the Effective Date, the revised UT Code and the enhanced KFS disclosures for derivative investments (see Question 4 below) will apply to new funds with new management companies and new trustees/custodians with immediate effect. For further details on the implementation and transition arrangements, please refer to the implementation schedule as set out in the revised UT Code.|||\n|2.|Will SFC’s prior approval and advance notice to investors be required for changes made to comply with the revised UT Code?|If changes are made by existing funds to comply with the revised UT Code and there are no material changes to the funds’ investment objectives, policies or strategies, prior approval from the SFC and advance notice to investors will generally not be required. However, management companies should provide necessary updates to the holders of the funds regarding the changes made to the funds as soon as reasonably practicable (whether by a specific notice or in the financial report of the funds) for holders’ appraisal of the funds and their investments. A summary of the changes (including the reason(s) and description of the change, implications to the funds and the resulting impact on investors) is expected to be provided to keep holders informed and enable them to appraise the position of the funds.|\n|Offering documents|||\n|3. If the funds’ offering documents are revised to Where changes to the offering documents of the existing funds are made to reflect comply with the enhanced disclosures the enhanced disclosures and contents requirements necessary for compliance with requirements under the revised UT Code, will the revised UT Code, SFC’s prior approval and advance notice to investors will these amendments be subject to the prior generally not be required (further see Question 8 below). The updated offering approval by the SFC? documents should be filed with the SFC in accordance with 11.1B of the revised UT|||\n\n\n-----\n\n",
  },
  {
    sourceType: SOURCE_TYPE_ENUM.file,
    fileId: "a81a0050-d09f-4faa-a000-c2e74c44bcab",
    fileName:
      "Frequently Asked Questions on the Implementation and Transition Arrangements of the Code on Unit Tru (1).pdf",
    url: "https://www.sfc.hk/en/Welcome-to-the-Fintech-Contact-Point/Virtual-assets/Virtual-asset-trading-platforms-operators/Regulatory-requirements/FAQs-on-conduct-related-matters/Cybersecurity/1-March-2024-Cybersecurity#3AE548D914154F8D94D5EBB5A7D75A7B",
    pages: [1, 7, 9],
    content:
      "|Col1|Question|Answer|\n|---|---|---|\n|General|||\n|1. The revised UT Code will become effective on 1 A 12-month transition period (“Transition Period”) from the Effective Date ending on January 2019 (“Effective Date”). Will there be 31 December 2019 will be provided for existing funds and existing management any transition period for existing funds? companies and trustees/custodians. With effect from the Effective Date, the revised UT Code and the enhanced KFS disclosures for derivative investments (see Question 4 below) will apply to new funds with new management companies and new trustees/custodians with immediate effect. For further details on the implementation and transition arrangements, please refer to the implementation schedule as set out in the revised UT Code.|||\n|2.|Will SFC’s prior approval and advance notice to investors be required for changes made to comply with the revised UT Code?|If changes are made by existing funds to comply with the revised UT Code and there are no material changes to the funds’ investment objectives, policies or strategies, prior approval from the SFC and advance notice to investors will generally not be required. However, management companies should provide necessary updates to the holders of the funds regarding the changes made to the funds as soon as reasonably practicable (whether by a specific notice or in the financial report of the funds) for holders’ appraisal of the funds and their investments. A summary of the changes (including the reason(s) and description of the change, implications to the funds and the resulting impact on investors) is expected to be provided to keep holders informed and enable them to appraise the position of the funds.|\n|Offering documents|||\n|3. If the funds’ offering documents are revised to Where changes to the offering documents of the existing funds are made to reflect comply with the enhanced disclosures the enhanced disclosures and contents requirements necessary for compliance with requirements under the revised UT Code, will the revised UT Code, SFC’s prior approval and advance notice to investors will these amendments be subject to the prior generally not be required (further see Question 8 below). The updated offering approval by the SFC? documents should be filed with the SFC in accordance with 11.1B of the revised UT|||\n\n\n-----\n\n",
  },
  {
    sourceType: SOURCE_TYPE_ENUM.file,
    fileId: "a81a0050-d09f-4faa-a000-c2e74c44bcab",
    fileName:
      "Frequently Asked Questions on the Implementation and Transition Arrangements of the Code on Unit Tru (1).pdf",
    url: "https://www.sfc.hk/en/Welcome-to-the-Fintech-Contact-Point/Virtual-assets/Virtual-asset-trading-platforms-operators/Regulatory-requirements/FAQs-on-conduct-related-matters/Cybersecurity/1-March-2024-Cybersecurity#3AE548D914154F8D94D5EBB5A7D75A7B",
    pages: [1, 7, 9],
    content:
      "|Col1|Question|Answer|\n|---|---|---|\n|General|||\n|1. The revised UT Code will become effective on 1 A 12-month transition period (“Transition Period”) from the Effective Date ending on January 2019 (“Effective Date”). Will there be 31 December 2019 will be provided for existing funds and existing management any transition period for existing funds? companies and trustees/custodians. With effect from the Effective Date, the revised UT Code and the enhanced KFS disclosures for derivative investments (see Question 4 below) will apply to new funds with new management companies and new trustees/custodians with immediate effect. For further details on the implementation and transition arrangements, please refer to the implementation schedule as set out in the revised UT Code.|||\n|2.|Will SFC’s prior approval and advance notice to investors be required for changes made to comply with the revised UT Code?|If changes are made by existing funds to comply with the revised UT Code and there are no material changes to the funds’ investment objectives, policies or strategies, prior approval from the SFC and advance notice to investors will generally not be required. However, management companies should provide necessary updates to the holders of the funds regarding the changes made to the funds as soon as reasonably practicable (whether by a specific notice or in the financial report of the funds) for holders’ appraisal of the funds and their investments. A summary of the changes (including the reason(s) and description of the change, implications to the funds and the resulting impact on investors) is expected to be provided to keep holders informed and enable them to appraise the position of the funds.|\n|Offering documents|||\n|3. If the funds’ offering documents are revised to Where changes to the offering documents of the existing funds are made to reflect comply with the enhanced disclosures the enhanced disclosures and contents requirements necessary for compliance with requirements under the revised UT Code, will the revised UT Code, SFC’s prior approval and advance notice to investors will these amendments be subject to the prior generally not be required (further see Question 8 below). The updated offering approval by the SFC? documents should be filed with the SFC in accordance with 11.1B of the revised UT|||\n\n\n-----\n\n",
  },
  {
    sourceType: SOURCE_TYPE_ENUM.file,
    fileId: "a81a0050-d09f-4faa-a000-c2e74c44bcab",
    fileName:
      "Frequently Asked Questions on the Implementation and Transition Arrangements of the Code on Unit Tru (1).pdf",
    url: "https://www.sfc.hk/en/Welcome-to-the-Fintech-Contact-Point/Virtual-assets/Virtual-asset-trading-platforms-operators/Regulatory-requirements/FAQs-on-conduct-related-matters/Cybersecurity/1-March-2024-Cybersecurity#3AE548D914154F8D94D5EBB5A7D75A7B",
    pages: [1, 7, 9],
    content:
      "|Col1|Question|Answer|\n|---|---|---|\n|General|||\n|1. The revised UT Code will become effective on 1 A 12-month transition period (“Transition Period”) from the Effective Date ending on January 2019 (“Effective Date”). Will there be 31 December 2019 will be provided for existing funds and existing management any transition period for existing funds? companies and trustees/custodians. With effect from the Effective Date, the revised UT Code and the enhanced KFS disclosures for derivative investments (see Question 4 below) will apply to new funds with new management companies and new trustees/custodians with immediate effect. For further details on the implementation and transition arrangements, please refer to the implementation schedule as set out in the revised UT Code.|||\n|2.|Will SFC’s prior approval and advance notice to investors be required for changes made to comply with the revised UT Code?|If changes are made by existing funds to comply with the revised UT Code and there are no material changes to the funds’ investment objectives, policies or strategies, prior approval from the SFC and advance notice to investors will generally not be required. However, management companies should provide necessary updates to the holders of the funds regarding the changes made to the funds as soon as reasonably practicable (whether by a specific notice or in the financial report of the funds) for holders’ appraisal of the funds and their investments. A summary of the changes (including the reason(s) and description of the change, implications to the funds and the resulting impact on investors) is expected to be provided to keep holders informed and enable them to appraise the position of the funds.|\n|Offering documents|||\n|3. If the funds’ offering documents are revised to Where changes to the offering documents of the existing funds are made to reflect comply with the enhanced disclosures the enhanced disclosures and contents requirements necessary for compliance with requirements under the revised UT Code, will the revised UT Code, SFC’s prior approval and advance notice to investors will these amendments be subject to the prior generally not be required (further see Question 8 below). The updated offering approval by the SFC? documents should be filed with the SFC in accordance with 11.1B of the revised UT|||\n\n\n-----\n\n",
  },
];

export const SourceSection = ({
  title = "Sources",
  items = sources,
}: SourceSectionProps) => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-row items-center justify-start gap-1">
        <Icon
          className="text-lg text-default-600"
          icon="solar:documents-bold-duotone"
        />
        <span className="text-slate-500">{title}:</span>
      </div>
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2">
        {items.map((item, index) => (
          <SourceCard key={index + 1} index={index + 1} source={item} />
        ))}
      </section>
    </div>
  );
};
